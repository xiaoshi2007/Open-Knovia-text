import { useState } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Select, Space, message } from 'antd';
import { CheckSquareOutlined, FileDoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const initialHomework = [
  { id: 'h1', task: '算法作业 #6', className: '2024级计科1班', submitted: 42, total: 45, status: '待批改' },
  { id: 'h2', task: '数据库作业 #4', className: '2024级软工1班', submitted: 38, total: 38, status: '批改中' },
  { id: 'h3', task: '数据结构作业 #3', className: '2024级计科2班', submitted: 40, total: 42, status: '待批改' },
];

export default function AssistantHomeworkReview() {
  const [homework, setHomework] = useState(initialHomework);
  const [classFilter, setClassFilter] = useState<string>();

  const filtered = homework.filter((item) => (classFilter ? item.className === classFilter : true));

  const markReviewed = (id: string) => {
    setHomework((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已完成' } : item)));
    message.success('已标记为批改完成');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>✅ 助教作业批改</Title>
          <Text type="secondary">助教负责批改进度跟踪、质量复核与结果回传</Text>
        </div>
        <Select
          allowClear
          placeholder="按班级筛选"
          style={{ width: 220 }}
          value={classFilter}
          onChange={setClassFilter}
          options={[...new Set(initialHomework.map((x) => x.className))].map((x) => ({ value: x, label: x }))}
        />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <CheckSquareOutlined style={{ fontSize: 24, color: '#6366f1', marginBottom: 8 }} />
            <div className="stat-number">{filtered.length}</div>
            <Text type="secondary">待处理作业任务</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <FileDoneOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <div className="stat-number">{filtered.filter((x) => x.status === '已完成').length}</div>
            <Text type="secondary">已完成批改</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <div className="stat-number">
              {filtered.length ? Math.round((filtered.reduce((acc, cur) => acc + cur.submitted, 0) / filtered.reduce((acc, cur) => acc + cur.total, 0)) * 100) : 0}%
            </div>
            <Text type="secondary">平均提交率</Text>
          </Card>
        </Col>
      </Row>

      <Card title="作业批改任务池" bordered={false} className="card-hover">
        <Table
          rowKey="id"
          dataSource={filtered}
          pagination={false}
          columns={[
            { title: '作业任务', dataIndex: 'task' },
            { title: '班级', dataIndex: 'className' },
            { title: '提交进度', render: (_, r) => `${r.submitted}/${r.total}` },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => (
                <Tag color={v === '已完成' ? 'green' : v === '批改中' ? 'blue' : 'orange'}>{v}</Tag>
              ),
            },
            {
              title: '操作',
              render: (_, r) => (
                <Space>
                  <Button size="small">查看详情</Button>
                  <Button size="small" type="primary" disabled={r.status === '已完成'} onClick={() => markReviewed(r.id)}>
                    完成批改
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

