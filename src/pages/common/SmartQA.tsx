import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Tag, Space, Divider, message, Select, Card, Alert } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  BulbOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import './SmartQA.css';
import { useAppStore } from '../../store/appStore';
import {
  LLMProvider,
  LLMSettings,
  chatWithLLM,
  generateRandomQuestion,
  analyzeWeakPoints,
  getProviderDefault,
} from '../../services/llm';

const { Title, Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface WeakPoint {
  topic: string;
  reason: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

// 预设示例问题
const sampleQuestions = [
  { label: '📚 学习方法', q: '如何高效学习一门新的编程语言？' },
  { label: '🧠 知识管理', q: '什么是知识图谱？它有哪些应用场景？' },
  { label: '💼 面试准备', q: '算法面试中常见的动态规划问题有哪些？' },
  { label: '🔬 人工智能', q: '机器学习和深度学习有什么区别？' },
  { label: '📊 数据分析', q: '如何用Python进行数据清洗和预处理？' },
  { label: '🎯 职业规划', q: '计算机专业毕业生的就业方向有哪些？' },
];

function getStorageKey(userId: string) {
  return `zhimai_qa_memory_${userId || 'guest'}`;
}

// 将 markdown-like 文本转为简单 HTML
function renderContent(text: string) {
  // 简单处理：加粗、代码块、列表、引用块、表格、换行
  let html = text
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="qa-code-block"><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="qa-inline-code">$1</code>')
    // 加粗
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 引用块
    .replace(/^>\s*(.+)$/gm, '<div class="qa-quote">$1</div>')
    // 表格行
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = cells.some(c => c.includes('---'));
      if (isHeader) return '';
      const tds = cells.map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    });

  // 包裹表格
  if (html.includes('<tr>')) {
    html = html.replace(/((<tr>.*<\/tr>\s*)+)/g, '<table class="qa-table">$1</table>');
  }

  // 换行
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n(?!\s*<)/g, '<br/>');

  return html;
}

export default function SmartQA() {
  const user = useAppStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [settings, setSettings] = useState<LLMSettings>(() => ({
    provider: 'openrouter',
    model: getProviderDefault('openrouter').model,
    apiKey: '',
    baseUrl: getProviderDefault('openrouter').baseUrl,
  }));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const storageKey = getStorageKey(user.id);
  const roleLabel = user.role === 'teacher' ? '教师' : user.role === 'enterprise' ? '企业HR' : '学生';

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setWeakPoints(parsed.weakPoints || []);
      } catch {
        // ignore
      }
    }
    const savedSettings = localStorage.getItem('zhimai_qa_llm_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ messages, weakPoints }));
  }, [messages, weakPoints, storageKey]);

  useEffect(() => {
    localStorage.setItem('zhimai_qa_llm_settings', JSON.stringify(settings));
  }, [settings]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const question = text || input.trim();
    if (!question || loading) return;
    if (!settings.apiKey) {
      message.warning('请先配置大模型 API Key');
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = [...messages.slice(-8), userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      const promptMessages = [
        {
          role: 'system' as const,
          content: `你是知脉平台的智能学习助手，服务对象是${roleLabel}。请给出结构化、可执行、准确的回答；若问题不清晰，先补充澄清问题。`,
        },
        ...context,
      ];
      const reply = await chatWithLLM(settings, promptMessages);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `抱歉，回答生成失败：${(err as Error).message || '请稍后重试'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setWeakPoints([]);
    localStorage.removeItem(storageKey);
    message.success('对话历史已清除');
  };

  const handleRandomQuestion = async () => {
    if (loading) return;
    if (!settings.apiKey) {
      message.warning('请先配置大模型 API Key');
      return;
    }
    try {
      setLoading(true);
      const question = await generateRandomQuestion(settings, roleLabel);
      setInput(question);
      message.success('已生成随机问题');
    } catch (err) {
      message.error(`随机提问失败：${(err as Error).message || '请稍后重试'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWeakPoints = async () => {
    const qaPairs = messages
      .filter((m) => m.role === 'user')
      .map((m) => ({
        q: m.content,
        a: messages.find((x) => x.role === 'assistant' && x.timestamp >= m.timestamp)?.content || '',
      }))
      .filter((item) => item.q && item.a);
    if (qaPairs.length < 2) {
      message.warning('至少进行2轮问答后再分析薄弱点');
      return;
    }
    if (!settings.apiKey) {
      message.warning('请先配置大模型 API Key');
      return;
    }
    try {
      setAnalyzing(true);
      const result = await analyzeWeakPoints(settings, qaPairs);
      setWeakPoints(result);
      message.success('已完成薄弱点分析');
    } catch (err) {
      message.error(`分析失败：${(err as Error).message || '请稍后重试'}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="smart-qa-page">
      {/* 左侧面板 */}
      <div className="qa-sidebar">
        <div className="qa-sidebar-header">
          <BulbOutlined style={{ fontSize: 20, color: '#6366f1' }} />
          <Text strong>智能问答</Text>
        </div>
        <div className="qa-sidebar-actions">
          <Card size="small" className="qa-settings-card">
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <Text strong style={{ fontSize: 12 }}>模型配置</Text>
              <Select
                size="small"
                value={settings.provider}
                options={[
                  { value: 'openrouter', label: 'OpenRouter' },
                  { value: 'openai', label: 'OpenAI' },
                  { value: 'deepseek', label: 'DeepSeek' },
                  { value: 'glm', label: '智谱GLM' },
                ]}
                onChange={(provider: LLMProvider) =>
                  setSettings({
                    ...settings,
                    provider,
                    model: getProviderDefault(provider).model,
                    baseUrl: getProviderDefault(provider).baseUrl,
                  })
                }
              />
              <Input.Password
                size="small"
                placeholder="API Key"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              />
              <Input
                size="small"
                placeholder="Model"
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              />
            </Space>
          </Card>
          <Button
            type="primary"
            block
            icon={<ThunderboltOutlined />}
            onClick={() => { clearHistory(); }}
            style={{ marginBottom: 8, borderRadius: 8 }}
          >
            新建对话
          </Button>
          <Button
            block
            icon={<SyncOutlined spin={loading} />}
            onClick={handleRandomQuestion}
            style={{ borderRadius: 8, marginBottom: 8 }}
          >
            随机提问
          </Button>
          <Button
            block
            icon={<HistoryOutlined />}
            loading={analyzing}
            onClick={handleAnalyzeWeakPoints}
            style={{ borderRadius: 8 }}
          >
            分析知识薄弱点
          </Button>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        {!!weakPoints.length && (
          <>
            <div className="qa-sidebar-title">🧩 薄弱点分析</div>
            <div className="qa-weak-list">
              {weakPoints.map((item, idx) => (
                <div className="qa-weak-item" key={`${item.topic}-${idx}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <Text strong style={{ fontSize: 12 }}>{item.topic}</Text>
                    <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'blue'}>
                      {item.priority}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.reason}</Text>
                  <div><Text style={{ fontSize: 12 }}>{item.suggestion}</Text></div>
                </div>
              ))}
            </div>
            <Divider style={{ margin: '12px 0' }} />
          </>
        )}
        <div className="qa-sidebar-title">💡 试试这些问题</div>
        <div className="qa-sample-list">
          {sampleQuestions.map((item) => (
            <div
              key={item.q}
              className="qa-sample-item"
              onClick={() => handleSend(item.q)}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
              <Text style={{ fontSize: 13 }}>{item.q}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧对话区 */}
      <div className="qa-chat-area">
        {!settings.apiKey && (
          <Alert
            type="info"
            showIcon
            message="请先在左侧配置大模型 API Key，支持 OpenAI / DeepSeek / GLM / OpenRouter"
            style={{ margin: 12 }}
          />
        )}
        {/* 消息列表 */}
        <div className="qa-messages">
          {messages.length === 0 && !loading && (
            <div className="qa-welcome">
              <div className="qa-welcome-icon">
                <RobotOutlined style={{ fontSize: 48, color: '#6366f1' }} />
              </div>
              <Title level={4} style={{ color: '#1e1b4b', marginTop: 16 }}>你好，我是知脉AI助手 👋</Title>
              <Text type="secondary" style={{ fontSize: 15 }}>
                我可以回答关于学习方法、知识管理、编程技术、职业规划等方面的问题。<br />
                从左侧选择一个问题开始，或直接在下方输入你的问题。
              </Text>
              <div className="qa-welcome-tags">
                {sampleQuestions.slice(0, 4).map((item) => (
                  <Tag
                    key={item.q}
                    className="qa-welcome-tag"
                    onClick={() => handleSend(item.q)}
                  >
                    {item.q}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`qa-message qa-message-${msg.role}`}>
              <div className={`qa-avatar qa-avatar-${msg.role}`}>
                {msg.role === 'user' ? (
                  <UserOutlined />
                ) : (
                  <RobotOutlined />
                )}
              </div>
              <div className={`qa-bubble qa-bubble-${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <div
                    className="qa-content"
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                ) : (
                  <div className="qa-content">{msg.content}</div>
                )}
                <div className="qa-time">
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="qa-message qa-message-assistant">
              <div className="qa-avatar qa-avatar-assistant">
                <RobotOutlined />
              </div>
              <div className="qa-bubble qa-bubble-assistant">
                <div className="qa-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区 */}
        <div className="qa-input-area">
          <Input.TextArea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            className="qa-input"
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="qa-send-btn"
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
