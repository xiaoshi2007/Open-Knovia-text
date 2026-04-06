import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Button, List, Divider, Progress } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  ReloadOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { Question } from '../../types';

const { Title, Text, Paragraph } = Typography;

export default function PracticeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { answers: Record<string, string | string[]>; questions: Question[] } | null;

  if (!state) {
    return (
      <Card style={{ textAlign: 'center', padding: 60 }}>
        <Text type="secondary">没有找到答题结果</Text>
        <br />
        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/student/practice')}>
          去练习
        </Button>
      </Card>
    );
  }

  const { answers, questions } = state;
  let correctCount = 0;
  const wrongQuestions: Question[] = [];

  questions.forEach((q) => {
    const ans = answers[q.id];
    const isCorrect = q.type === 'multiple'
      ? JSON.stringify((ans as string[])?.sort() || []) === JSON.stringify((q.answer as string[]).sort())
      : ans === q.answer;
    if (isCorrect) {
      correctCount++;
    } else {
      wrongQuestions.push(q);
    }
  });

  const total = questions.length;
  const score = Math.round((correctCount / total) * 100);
  const wrongCount = total - correctCount;

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = () => {
    if (score >= 90) return '优秀！继续保持 🎉';
    if (score >= 80) return '不错，再接再厉 👍';
    if (score >= 60) return '及格了，但还有提升空间 💪';
    return '需要加把劲了，建议复习后重试 📚';
  };

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>📊 答题结果分析</Title>
        <Text type="secondary">AI正在分析你的答题情况...</Text>
      </div>

      {/* Score Card */}
      <Card bordered={false} className="card-hover" style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 140, height: 140, borderRadius: '50%',
                background: `conic-gradient(${getScoreColor()} ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: 110, height: 110, borderRadius: '50%', background: 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 800, color: getScoreColor() }}>{score}</div>
                <Text type="secondary">分</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <Title level={4} style={{ color: getScoreColor(), marginBottom: 8 }}>
              {getScoreLabel()}
            </Title>
            <Row gutter={16}>
              <Col span={8}>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                  <div className="stat-number" style={{ fontSize: 28, color: '#10b981' }}>{correctCount}</div>
                  <Text type="secondary">答对</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                  <div className="stat-number" style={{ fontSize: 28, color: '#ef4444' }}>{wrongCount}</div>
                  <Text type="secondary">答错</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="stat-card" style={{ textAlign: 'center' }}>
                  <div className="stat-number" style={{ fontSize: 28 }}>{total}</div>
                  <Text type="secondary">总题数</Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* AI Suggestions */}
        <Col xs={24} lg={10}>
          <Card
            title={<><BarChartOutlined /> AI分析建议</>}
            bordered={false}
            className="card-hover"
          >
            <Paragraph>
              <Tag color="blue">知识点分析</Tag>
              你在数据结构基础方面表现良好，但在算法设计上需要加强。
            </Paragraph>
            <Paragraph>
              <Tag color="purple">学习建议</Tag>
              建议复习排序算法和图论基础知识，推荐做LeetCode相关练习。
            </Paragraph>
            <Paragraph>
              <Tag color="green">推荐路径</Tag>
              数组 → 排序算法 → 二分搜索 → 图论基础 → 最短路径
            </Paragraph>
            <Divider />
            <Button type="primary" block onClick={() => navigate('/student/ability-graph')}>
              查看能力图谱
            </Button>
          </Card>
        </Col>

        {/* Wrong Questions */}
        <Col xs={24} lg={14}>
          <Card
            title={<><CloseCircleOutlined style={{ color: '#ef4444' }} /> 错题列表</>}
            bordered={false}
            className="card-hover"
          >
            {wrongQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <TrophyOutlined style={{ fontSize: 48, color: '#f59e0b', marginBottom: 16 }} />
                <Title level={4}>全部正确！</Title>
                <Text type="secondary">太厉害了，没有错题！</Text>
              </div>
            ) : (
              <List
                dataSource={wrongQuestions}
                renderItem={(q) => (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <Text strong>{q.content}</Text>
                      <div style={{ marginTop: 8 }}>
                        <Tag color="red">你的答案: {Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join(', ') : answers[q.id] || '未作答'}</Tag>
                        <Tag color="green">正确答案: {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</Tag>
                      </div>
                      <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 13 }}>
                        💡 {q.explanation}
                      </Paragraph>
                    </div>
                  </List.Item>
                )}
              />
            )}
            <Button
              icon={<ReloadOutlined />}
              block
              style={{ marginTop: 16 }}
              onClick={() => navigate('/student/practice')}
            >
              重新练习
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
