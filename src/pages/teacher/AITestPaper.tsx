import { useState } from 'react';
import { Card, Form, Select, Slider, InputNumber, Button, Typography, Tag, List, Space, Spin, Empty, Row, Col, Divider } from 'antd';
import { RobotOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { mockCourses, mockQuestions } from '../../data/mockData';

const { Title, Text, Paragraph } = Typography;

export default function AITestPaper() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [form] = Form.useForm();

  const handleGenerate = () => {
    form.validateFields().then(() => {
      setLoading(true);
      // TODO: 未来调用 aiAPI.generateQuestions() 获取AI生成的试卷
      setTimeout(() => {
        setLoading(false);
        setGenerated(true);
      }, 2000);
    });
  };

  const handleReset = () => {
    setGenerated(false);
    form.resetFields();
  };

  const difficultyLabels: Record<number, string> = { 1: '简单', 2: '较易', 3: '中等', 4: '较难', 5: '困难' };
  const difficultyColors: Record<number, string> = { 1: 'green', 2: 'cyan', 3: 'blue', 4: 'orange', 5: 'red' };

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>🤖 AI智能组卷</Title>
        <Text type="secondary">基于知识图谱和学情数据，AI自动生成个性化试卷</Text>
      </div>

      <Row gutter={24}>
        {/* Form */}
        <Col xs={24} lg={8}>
          <Card
            title={<><RobotOutlined /> 组卷参数</>}
            bordered={false}
            className="card-hover"
            style={{ borderRadius: 12 }}
          >
            <Form form={form} layout="vertical" initialValues={{ courseId: 'c001', difficulty: 3, count: 5 }}>
              <Form.Item label="选择课程" name="courseId" rules={[{ required: true }]}>
                <Select options={mockCourses.map(c => ({ value: c.id, label: c.name }))} />
              </Form.Item>

              <Form.Item label="选择章节" name="chapterId">
                <Select
                  allowClear
                  placeholder="全部章节"
                  options={mockCourses.flatMap(c =>
                    c.chapters.map(ch => ({ value: ch.id, label: `${c.name} - ${ch.name}` }))
                  )}
                />
              </Form.Item>

              <Form.Item label="难度等级" name="difficulty">
                <Slider
                  min={1} max={5} step={1}
                  marks={{ 1: '简单', 2: '较易', 3: '中等', 4: '较难', 5: '困难' }}
                  tooltip={{ formatter: (v) => difficultyLabels[v || 3] }}
                />
              </Form.Item>

              <Form.Item label="题目数量" name="count">
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button onClick={handleReset}>重置</Button>
                <Button
                  type="primary"
                  icon={<RobotOutlined />}
                  onClick={handleGenerate}
                  loading={loading}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  {loading ? 'AI生成中...' : '生成试卷'}
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        {/* Result / Preview */}
        <Col xs={24} lg={16}>
          <Card
            title={<><FileTextOutlined /> 试卷预览</>}
            bordered={false}
            className="card-hover"
            style={{ borderRadius: 12 }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin size="large" />
                <Title level={4} style={{ marginTop: 16, color: '#6366f1' }}>
                  🤖 AI正在生成试卷...
                </Title>
                <Text type="secondary">分析知识点覆盖度和难度分布中</Text>
              </div>
            ) : generated ? (
              <>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color="green"><CheckCircleOutlined /> 已生成</Tag>
                    <Tag color="blue">共 {mockQuestions.length} 题</Tag>
                    <Tag color="purple">总分 {mockQuestions.length * 20}</Tag>
                  </Space>
                  <Space>
                    <Button>导出Word</Button>
                    <Button type="primary">发布给学生</Button>
                  </Space>
                </div>
                <Divider />
                <List
                  dataSource={mockQuestions}
                  renderItem={(q, idx) => (
                    <List.Item style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: '#1e1b4b' }}>
                          {idx + 1}. [{q.type === 'single' ? '单选' : q.type === 'multiple' ? '多选' : q.type}] ({q.difficulty * 4}分)
                        </Text>
                        <Tag color={difficultyColors[q.difficulty]} style={{ marginLeft: 8 }}>
                          {difficultyLabels[q.difficulty]}
                        </Tag>
                      </div>
                      <Paragraph style={{ marginLeft: 20, marginBottom: 8 }}>{q.content}</Paragraph>
                      {q.options && (
                        <div style={{ marginLeft: 40 }}>
                          {q.options.map(opt => (
                            <Paragraph key={opt.key} style={{ marginBottom: 2 }}>
                              {opt.key}. {opt.text}
                            </Paragraph>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: 4, marginLeft: 20 }}>
                        {q.tags.map(t => <Tag key={t} style={{ fontSize: 11 }}>{t}</Tag>)}
                      </div>
                      {idx < mockQuestions.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <Empty
                description="配置组卷参数后，AI将自动生成试卷"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Paragraph type="secondary" style={{ maxWidth: 400, textAlign: 'center', margin: '0 auto' }}>
                  AI将根据您选择的课程、章节、难度等参数，结合知识图谱自动生成覆盖全面的试卷题目
                </Paragraph>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
