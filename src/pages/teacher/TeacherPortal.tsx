import { Card, Row, Col, Typography, List, Tag, Badge } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const { Title, Text } = Typography;

const classStats = [
  { name: '2024级计科1班', students: 45, avgScore: 82, progress: 68 },
  { name: '2024级计科2班', students: 42, avgScore: 76, progress: 55 },
  { name: '2024级软工1班', students: 38, avgScore: 85, progress: 72 },
];

const pendingReviews = [
  { id: 1, title: '数据结构期中测试 - 1班', submitted: 43, total: 45 },
  { id: 2, title: '数据结构期中测试 - 2班', submitted: 40, total: 42 },
  { id: 3, title: '算法作业 #5', submitted: 78, total: 125 },
];

const recentActivities = [
  { date: '2026-04-03', content: '发布了"数据结构期中测试"试卷' },
  { date: '2026-04-02', content: '更新了"图论基础"章节知识图谱' },
  { date: '2026-03-30', content: '完成了1班第3章教学任务' },
  { date: '2026-03-28', content: 'AI自动批改了42份作业' },
];

const pieOption = {
  tooltip: { trigger: 'item' as const },
  legend: { bottom: '5%', left: 'center' },
  series: [
    {
      name: '学生成绩分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 35, name: '优秀 (≥90)', itemStyle: { color: '#10b981' } },
        { value: 48, name: '良好 (80-89)', itemStyle: { color: '#6366f1' } },
        { value: 28, name: '中等 (70-79)', itemStyle: { color: '#f59e0b' } },
        { value: 10, name: '待提高 (<70)', itemStyle: { color: '#ef4444' } },
      ],
    },
  ],
};

export default function TeacherPortal() {
  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>
          👨‍🏫 你好，赵教授
        </Title>
        <Text type="secondary">您有 3 项待批改任务</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <TeamOutlined style={{ fontSize: 24, color: '#6366f1', marginBottom: 8 }} />
            <div className="stat-number">3</div>
            <Text type="secondary">所教班级</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <RiseOutlined style={{ fontSize: 24, color: '#8b5cf6', marginBottom: 8 }} />
            <div className="stat-number">125</div>
            <Text type="secondary">学生总数</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <FileTextOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
            <div className="stat-number">161</div>
            <Text type="secondary">待批改试卷</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <CalendarOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <div className="stat-number">6</div>
            <Text type="secondary">近期教学活动</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Score Distribution */}
        <Col xs={24} lg={8}>
          <Card title="成绩分布" bordered={false} className="card-hover">
            <ReactEChartsCore echarts={echarts} option={pieOption} style={{ height: 300 }} notMerge />
          </Card>
        </Col>

        {/* Class List */}
        <Col xs={24} lg={8}>
          <Card title={<><TeamOutlined /> 所教班级</>} bordered={false} className="card-hover">
            <List
              dataSource={classStats}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Text strong>{item.name}</Text>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <Tag color="blue">{item.students}人</Tag>
                      <Tag color="green">均分 {item.avgScore}</Tag>
                      <Tag color="purple">进度 {item.progress}%</Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Pending Reviews */}
        <Col xs={24} lg={8}>
          <Card title={<><FileTextOutlined /> 待批改试卷</>} bordered={false} className="card-hover">
            <List
              dataSource={pendingReviews}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Text strong>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      已提交 {item.submitted}/{item.total}
                      {item.submitted === item.total && (
                        <Badge status="success" text="全部提交" style={{ marginLeft: 8 }} />
                      )}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title={<><CalendarOutlined /> 近期教学活动</>} bordered={false} className="card-hover" style={{ marginTop: 24 }}>
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#10b981', marginTop: 4 }} />}
                title={<Text>{item.content}</Text>}
                description={<Text type="secondary">{item.date}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
