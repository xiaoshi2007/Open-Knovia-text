import { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { NotificationOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const initialQuizList = [
  { key: 'q1', name: '链表与栈基础测验', className: '2024级计科1班', publishAt: '10:05', submitRate: 91, avgScore: 78 },
  { key: 'q2', name: '排序算法随堂测', className: '2024级计科2班', publishAt: '14:20', submitRate: 84, avgScore: 73 },
];

export default function InClassQuizCenter() {
  const [quizList, setQuizList] = useState(initialQuizList);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handlePublish = async () => {
    const values = await form.validateFields();
    setQuizList((prev) => [
      {
        key: `new-${Date.now()}`,
        name: values.name,
        className: values.className,
        publishAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        submitRate: 0,
        avgScore: 0,
      },
      ...prev,
    ]);
    setOpen(false);
    form.resetFields();
    message.success('随堂小测已发布（示意）');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>📝 随堂小测发布</Title>
          <Text type="secondary">老师可快速发布课堂测验，并实时回收答题数据</Text>
        </div>
        <Button type="primary" icon={<NotificationOutlined />} onClick={() => setOpen(true)}>
          发布新测验
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <div className="stat-number">{quizList.length}</div>
            <Text type="secondary">今日发布测验</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <div className="stat-number">87%</div>
            <Text type="secondary">平均提交率</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <div className="stat-number">75</div>
            <Text type="secondary">平均得分</Text>
          </Card>
        </Col>
      </Row>

      <Card title={<><BarChartOutlined /> 小测数据收集看板</>} bordered={false} className="card-hover">
        <Table
          rowKey="key"
          dataSource={quizList}
          pagination={false}
          columns={[
            { title: '测验名称', dataIndex: 'name' },
            { title: '班级', dataIndex: 'className' },
            { title: '发布时间', dataIndex: 'publishAt' },
            {
              title: '提交率',
              dataIndex: 'submitRate',
              render: (v: number) => <Tag color={v >= 85 ? 'green' : v >= 70 ? 'blue' : 'orange'}>{v}%</Tag>,
            },
            {
              title: '平均分',
              dataIndex: 'avgScore',
              render: (v: number) => <Text strong style={{ color: v >= 80 ? '#10b981' : v >= 70 ? '#6366f1' : '#ef4444' }}>{v}</Text>,
            },
          ]}
        />
      </Card>

      <Modal
        title="发布随堂小测"
        open={open}
        onOk={handlePublish}
        onCancel={() => setOpen(false)}
        okText="发布"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ count: 5 }}>
          <Form.Item label="测验名称" name="name" rules={[{ required: true, message: '请输入测验名称' }]}>
            <Input placeholder="例如：树与二叉树随堂测" />
          </Form.Item>
          <Form.Item label="班级" name="className" rules={[{ required: true, message: '请输入班级' }]}>
            <Input placeholder="例如：2024级计科1班" />
          </Form.Item>
          <Space style={{ width: '100%' }}>
            <Form.Item label="题目数量" name="count" style={{ flex: 1 }}>
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

