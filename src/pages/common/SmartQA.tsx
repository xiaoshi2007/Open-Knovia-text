import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Tag, Space, Empty, Spin, Divider, message } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  BulbOutlined,
  DeleteOutlined,
  ExpandOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import './SmartQA.css';

const { Title, Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
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

// 模拟AI回复（演示用）
const generateMockReply = (question: string): Promise<string> => {
  const replies: Record<string, string> = {
    '编程语言': `**高效学习编程语言的方法：**

1. **明确目标** — 先想清楚学这门语言要做什么（Web开发？数据分析？AI？），有目标才有动力。

2. **官方文档先行** — 通读一遍官方Tutorial，建立整体认知，再按需深入。

3. **项目驱动学习** — 不要只看教程，动手做项目。哪怕是一个小工具、一个CLI脚本，比刷100道练习题有用。

4. **阅读优质源码** — 在GitHub上找优秀的开源项目，看别人怎么组织代码、解决问题。

5. **费曼学习法** — 尝试写博客或教别人。能讲清楚，说明你真的理解了。

6. **间隔重复** — 用Anki记录关键API和语法，定期复习。

7. **加入社区** — Discord、Reddit、Stack Overflow，遇到问题及时问，别卡太久。

> 💡 记住：语言只是工具，编程思维才是核心竞争力。`,

    '知识图谱': `**知识图谱（Knowledge Graph）是一种结构化的知识表示方式。**

🔗 **核心概念：**
- **实体（Entity）** — 如"Python"、"机器学习"、"清华大学"
- **关系（Relation）** — 如"属于"、"先修"、"毕业于"
- **属性（Attribute）** — 如"难度：中等"、"创建时间：1991年"

🏢 **应用场景：**
1. **智能搜索** — Google知识图谱、百度知心
2. **智能问答** — 理解用户意图，精准回答
3. **推荐系统** — 基于知识关联做推荐
4. **教育领域** — 学科知识图谱、能力图谱建模
5. **医疗健康** — 疾病-症状-药物关系图谱
6. **金融风控** — 企业关联图谱

🏗️ **构建流程：**
数据采集 → 实体抽取 → 关系抽取 → 知识融合 → 质量评估 → 图谱存储

在"知脉"平台中，我们正是基于知识图谱来建模学生的能力体系，实现精准的能力评估和个性化推荐。`,

    '动态规划': `**高频动态规划面试题分类：**

📌 **经典入门（必刷）：**
- 爬楼梯 / 斐波那契
- 最长公共子序列（LCS）
- 0-1背包问题
- 最长递增子序列（LIS）

📌 **字符串类：**
- 编辑距离
- 正则表达式匹配
- 回文子串 / 回文子序列

📌 **区间DP：**
- 矩阵链乘法
- 戳气球
- 合并石子

📌 **状态压缩DP：**
- 旅行商问题（TSP）
- 骑士巡游

📌 **树形DP：**
- 打家劫舍 III
- 树的直径

🎯 **刷题建议：**
1. 先按类型集中刷，建立模式识别
2. 每道题先想状态定义和转移方程
3. 至少用两种方法实现（递归+记忆化、迭代）
4. 做完后总结这道题的状态维度是什么`,

    '机器学习': `**机器学习 vs 深度学习：**

📊 **机器学习（ML）：**
- 自动从数据中学习规律
- 需要人工提取特征（特征工程）
- 代表算法：决策树、SVM、随机森林、XGBoost
- 适用：结构化数据、中小规模问题

🧠 **深度学习（DL）：**
- ML的子集，使用多层神经网络
- 自动学习特征表示（端到端学习）
- 代表架构：CNN、RNN、Transformer、GAN
- 适用：图像、语音、文本等非结构化数据

**关键区别：**

| 维度 | 机器学习 | 深度学习 |
|------|---------|---------|
| 数据量需求 | 千~万级 | 万~亿级 |
| 计算资源 | CPU即可 | 需要GPU/TPU |
| 可解释性 | 较强 | 较弱（黑盒） |
| 训练时间 | 分钟~小时 | 小时~天 |
| 特征工程 | 必需 | 通常不需要 |

💡 **选择建议：**
- 表格数据 + 样本少 → 先试XGBoost/LightGBM
- 图像/文本 + 大数据 → 深度学习
- 实际项目中两者常常结合使用`,

    '数据清洗': `**Python数据清洗和预处理指南：**

📦 **核心工具：** pandas + numpy

🧹 **常见清洗步骤：**

\`\`\`python
import pandas as pd
import numpy as np

# 1. 加载数据
df = pd.read_csv('data.csv')

# 2. 查看数据概况
df.info()
df.describe()
df.isnull().sum()  # 缺失值统计

# 3. 处理缺失值
df.dropna()                          # 删除缺失行
df.fillna(df.mean())                 # 均值填充
df['col'].fillna(df['col'].mode()[0])  # 众数填充

# 4. 处理重复值
df.drop_duplicates()

# 5. 异常值检测
Q1 = df['col'].quantile(0.25)
Q3 = df['col'].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df['col'] < Q1 - 1.5*IQR) | (df['col'] > Q3 + 1.5*IQR)]

# 6. 数据类型转换
df['date'] = pd.to_datetime(df['date'])
df['category'] = df['category'].astype('category')

# 7. 编码分类变量
pd.get_dummies(df['gender'])  # One-Hot
from sklearn.preprocessing import LabelEncoder
LabelEncoder().fit_transform(df['label'])  # Label Encoding
\`\`\`

⚡ **进阶技巧：**
- 使用 \`scikit-learn\` 的 \`Pipeline\` 构建清洗流水线
- 大数据用 \`polars\` 替代 pandas，速度快10倍
- 用 \`ydata-profiling\` 自动生成数据质量报告`,

    '就业方向': `**计算机专业毕业生就业方向全景：**

💻 **技术路线：**
1. **后端开发** — Java/Go/Python，需求最大，起薪15-30K
2. **前端开发** — React/Vue/TypeScript，薪资不错，天花板略低
3. **算法工程师** — ML/DL/NLP/CV，门槛高，薪资30-60K+
4. **数据工程师** — ETL/数仓/实时计算，需求增长快
5. **运维/DevOps** — 云原生/K8S，越老越吃香
6. **安全工程师** — 网络安全/渗透测试，供不应求

🏢 **非技术路线：**
7. **产品经理** — 技术背景是加分项
8. **技术销售/售前** — B2B场景需求大
9. **技术咨询** — 四大/咨询公司

🚀 **热门方向：**
10. **AI应用开发** — LLM应用、RAG、Agent开发
11. **Web3/区块链** — 波动大但薪资高
12. **游戏开发** — Unity/Unreal，热爱驱动的方向

💡 **建议：**
- 大一多试，大二聚焦一个方向深入
- 实习 > 项目 > 比赛 > 证书
- 关注AI方向，这是未来5-10年的主旋律`,
  };

  return new Promise((resolve) => {
    // 匹配关键词
    let reply = '';
    for (const [keyword, response] of Object.entries(replies)) {
      if (question.includes(keyword)) {
        reply = response;
        break;
      }
    }
    if (!reply) {
      reply = `这是一个很好的问题！关于"${question}"，让我来分析一下：

**我的理解：**
您想了解这个话题的核心内容。由于当前是演示模式，我提供以下建议：

1. 📖 **查阅官方文档** — 获取最权威的信息
2. 🔍 **搜索学术论文** — 获取深入的理论分析
3. 💬 **请教领域专家** — 获取实践经验
4. 🛠️ **动手实践** — 最好的学习方式

> 💡 在正式版本中，这里将接入AI大语言模型，为您提供精准、详细的智能问答服务。

如需了解更多，您可以尝试问我关于**学习方法、知识图谱、算法面试、人工智能、数据分析、职业规划**等话题的问题！`;
    }

    // 模拟打字效果延迟
    setTimeout(() => resolve(reply), 800 + Math.random() * 1200);
  });
};

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 加载历史
  const history: Message[] = JSON.parse(sessionStorage.getItem('zhimai_qa_history') || '[]');

  const handleSend = async (text?: string) => {
    const question = text || input.trim();
    if (!question || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // 保存历史
    const newHistory = [...history, userMsg];
    sessionStorage.setItem('zhimai_qa_history', JSON.stringify(newHistory));

    try {
      const reply = await generateMockReply(question);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // 保存历史
      const allHistory = [...newHistory, assistantMsg];
      sessionStorage.setItem('zhimai_qa_history', JSON.stringify(allHistory));
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，回答生成失败，请稍后重试。',
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
    sessionStorage.removeItem('zhimai_qa_history');
    message.success('对话历史已清除');
  };

  // 加载历史对话
  const loadHistory = () => {
    setMessages(history);
    setShowHistory(false);
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
          <Button
            type="primary"
            block
            icon={<ThunderboltOutlined />}
            onClick={() => { clearHistory(); }}
            style={{ marginBottom: 8, borderRadius: 8 }}
          >
            新建对话
          </Button>
          {history.length > 0 && messages.length === 0 && (
            <Button
              block
              icon={<HistoryOutlined />}
              onClick={loadHistory}
              style={{ borderRadius: 8 }}
            >
              恢复历史对话
            </Button>
          )}
        </div>
        <Divider style={{ margin: '12px 0' }} />
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
