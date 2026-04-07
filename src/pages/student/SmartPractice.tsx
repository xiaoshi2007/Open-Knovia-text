import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Typography, Tag, Progress, List } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';
import { mockQuestions } from '../../data/mockData';
import type { Question } from '../../types';

const { Title, Text } = Typography;

export default function SmartPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const customQuestions = (location.state as { customQuestions?: Question[] } | null)?.customQuestions;
  const questions = customQuestions && customQuestions.length > 0 ? customQuestions : mockQuestions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const question = questions[currentIdx];

  const handleAnswer = (qId: string, value: string) => {
    if (submitted) return;
    const q = questions.find(q => q.id === qId);
    if (q?.type === 'multiple') {
      const prev = (answers[qId] as string[]) || [];
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers({ ...answers, [qId]: next });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // TODO: 未来调用 aiAPI.analyzeResult() 获取AI分析结果
    setTimeout(() => navigate('/student/practice/result', { state: { answers, questions } }), 500);
  };

  const isAnswered = (qId: string) => !!answers[qId] && (Array.isArray(answers[qId]) ? answers[qId].length > 0 : true);

  const getDifficultyColor = (d: number) => {
    if (d <= 2) return 'green';
    if (d <= 3) return 'blue';
    return 'red';
  };

  const difficultyLabels: Record<number, string> = { 1: '简单', 2: '较易', 3: '中等', 4: '较难', 5: '困难' };

  const answeredCount = questions.filter(q => isAnswered(q.id)).length;

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>📝 智能练习</Title>
        <Text type="secondary">
          数据结构与算法 · 已答 {answeredCount}/{questions.length} 题
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Progress
          percent={Math.round((answeredCount / questions.length) * 100)}
          strokeColor="#6366f1"
          format={() => `${answeredCount}/${questions.length}`}
        />
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Question List */}
        <Card
          title="题目列表"
          bordered={false}
          style={{ width: 260, flexShrink: 0, borderRadius: 12 }}
          size="small"
        >
          <List
            size="small"
            dataSource={questions}
            renderItem={(q, idx) => (
              <List.Item
                onClick={() => setCurrentIdx(idx)}
                style={{
                  cursor: 'pointer',
                  background: idx === currentIdx ? '#eef2ff' : 'transparent',
                  borderRadius: 6,
                  padding: '8px 12px',
                  marginBottom: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 12,
                      background: isAnswered(q.id) ? '#10b981' : '#e5e7eb',
                      color: isAnswered(q.id) ? 'white' : '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {isAnswered(q.id) ? '✓' : idx + 1}
                  </div>
                  <Text ellipsis style={{ fontSize: 13, flex: 1 }}>
                    {q.content.slice(0, 16)}...
                  </Text>
                  <Tag color={getDifficultyColor(q.difficulty)} style={{ fontSize: 10 }}>
                    {difficultyLabels[q.difficulty]}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* Question Detail */}
        <Card bordered={false} style={{ flex: 1, borderRadius: 12 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Tag color="purple">第 {currentIdx + 1} 题</Tag>
              <Tag color={getDifficultyColor(question.difficulty)}>
                {question.type === 'single' ? '单选' : question.type === 'multiple' ? '多选' : question.type}
              </Tag>
              <Tag color={getDifficultyColor(question.difficulty)}>
                {difficultyLabels[question.difficulty]}
              </Tag>
            </Space>
            <Space>
              {question.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </Space>
          </div>

          <Title level={4} style={{ marginBottom: 24, lineHeight: 1.6 }}>
            {question.content}
          </Title>

          {question.type === 'single' ? (
            <Radio.Group
              value={answers[question.id] as string}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              style={{ width: '100%' }}
              disabled={submitted}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {question.options?.map((opt) => {
                  const isSelected = answers[question.id] === opt.key;
                  const isCorrect = opt.key === question.answer;
                  return (
                    <Card
                      key={opt.key}
                      size="small"
                      style={{
                        cursor: 'pointer',
                        borderColor: submitted
                          ? isCorrect ? '#10b981' : isSelected ? '#ef4444' : '#e5e7eb'
                          : isSelected ? '#6366f1' : '#e5e7eb',
                        background: submitted
                          ? isCorrect ? '#f0fdf4' : isSelected ? '#fef2f2' : 'white'
                          : isSelected ? '#eef2ff' : 'white',
                        transition: 'all 0.2s',
                      }}
                      hoverable={!submitted}
                      onClick={() => handleAnswer(question.id, opt.key)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Radio value={opt.key} checked={false} disabled={submitted} />
                        <Text>
                          <strong>{opt.key}.</strong> {opt.text}
                        </Text>
                        {submitted && isCorrect && <CheckCircleOutlined style={{ color: '#10b981', marginLeft: 'auto' }} />}
                        {submitted && isSelected && !isCorrect && <CloseCircleOutlined style={{ color: '#ef4444', marginLeft: 'auto' }} />}
                      </div>
                    </Card>
                  );
                })}
              </Space>
            </Radio.Group>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.options?.map((opt) => {
                const selected = ((answers[question.id] as string[]) || []).includes(opt.key);
                return (
                  <Card
                    key={opt.key}
                    size="small"
                    style={{
                      cursor: 'pointer',
                      borderColor: selected ? '#6366f1' : '#e5e7eb',
                      background: selected ? '#eef2ff' : 'white',
                    }}
                    hoverable={!submitted}
                    onClick={() => handleAnswer(question.id, opt.key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: 4, border: `2px solid ${selected ? '#6366f1' : '#d1d5db'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: selected ? '#6366f1' : 'white',
                          color: 'white', fontSize: 12, fontWeight: 600,
                        }}
                      >
                        {selected ? '✓' : ''}
                      </div>
                      <Text><strong>{opt.key}.</strong> {opt.text}</Text>
                    </div>
                  </Card>
                );
              })}
            </Space>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
            >
              上一题
            </Button>
            <Space>
              {currentIdx < questions.length - 1 ? (
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                >
                  下一题
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  提交答卷
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
