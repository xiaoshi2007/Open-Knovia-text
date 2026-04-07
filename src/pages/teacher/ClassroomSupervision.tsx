import { Card, Row, Col, Typography, Progress, List, Tag, Badge } from 'antd';
import { EyeOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const liveClasses = [
  { id: 'c1', name: '2024级计科1班', online: 43, total: 45, abnormal: 2 },
  { id: 'c2', name: '2024级软工1班', online: 37, total: 38, abnormal: 1 },
  { id: 'c3', name: '2024级计科2班', online: 39, total: 42, abnormal: 3 },
];

const warnings = [
  { id: 1, className: '2024级计科2班', content: '3名学生连续离开页面超过5分钟', level: 'high' },
  { id: 2, className: '2024级计科1班', content: '2名学生答题异常快速，建议复核', level: 'medium' },
  { id: 3, className: '2024级软工1班', content: '课堂网络波动，已自动补偿采集', level: 'low' },
];

export default function ClassroomSupervision() {
  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>🛰️ 课堂监管</Title>
        <Text type="secondary">实时监控课堂在线状态、行为异常和风险预警</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <EyeOutlined style={{ fontSize: 24, color: '#6366f1', marginBottom: 8 }} />
            <div className="stat-number">3</div>
            <Text type="secondary">监管课堂数</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <CheckCircleOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <div className="stat-number">119</div>
            <Text type="secondary">在线学生</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <WarningOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
            <div className="stat-number">6</div>
            <Text type="secondary">风险提示</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="实时课堂状态" bordered={false} className="card-hover">
            <List
              dataSource={liveClasses}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text strong>{item.name}</Text>
                      <Tag color={item.abnormal > 2 ? 'red' : item.abnormal > 0 ? 'orange' : 'green'}>
                        异常 {item.abnormal}
                      </Tag>
                    </div>
                    <Progress
                      percent={Math.round((item.online / item.total) * 100)}
                      format={() => `${item.online}/${item.total} 在线`}
                      strokeColor="#6366f1"
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="课堂预警事件" bordered={false} className="card-hover">
            <List
              dataSource={warnings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge status={item.level === 'high' ? 'error' : item.level === 'medium' ? 'warning' : 'processing'} />}
                    title={<Text strong>{item.className}</Text>}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

