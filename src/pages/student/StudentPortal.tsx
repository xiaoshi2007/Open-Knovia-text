import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Progress, Tag, Typography, List } from 'antd';
import {
  BookOutlined,
  AimOutlined,
  FileTextOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { mockStudentAbilities } from '../../data/mockData';

echarts.use([RadarChart, RadarComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

const { Title, Text } = Typography;

const radarOption = {
  tooltip: {},
  radar: {
    indicator: [
      { name: 'Python', max: 5 },
      { name: '数据结构', max: 5 },
      { name: '算法', max: 5 },
      { name: '机器学习', max: 5 },
      { name: '前端', max: 5 },
      { name: '后端', max: 5 },
      { name: '沟通', max: 5 },
      { name: '协作', max: 5 },
    ],
    shape: 'circle' as const,
    splitNumber: 5,
    axisName: { color: '#6b7280', fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(99,102,241,0.02)', 'rgba(99,102,241,0.04)', 'rgba(99,102,241,0.06)', 'rgba(99,102,241,0.08)', 'rgba(99,102,241,0.1)'] } },
    splitLine: { lineStyle: { color: '#e5e7eb' } },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [4, 5, 4, 3, 3, 4, 4, 5],
          name: '当前水平',
          areaStyle: { color: 'rgba(99,102,241,0.2)' },
          lineStyle: { color: '#6366f1', width: 2 },
          itemStyle: { color: '#6366f1' },
        },
      ],
    },
  ],
};

const recommendedPaths = [
  { title: '算法进阶之路', progress: 45, tags: ['算法', '动态规划'] },
  { title: '前端全栈开发', progress: 30, tags: ['React', 'Node.js'] },
  { title: '机器学习实战', progress: 60, tags: ['PyTorch', '深度学习'] },
];

const pendingTasks = [
  { id: 1, title: '完成数据结构第3章测试', deadline: '明天', urgent: true },
  { id: 2, title: '提交算法作业 #5', deadline: '后天', urgent: false },
  { id: 3, title: '更新能力认证材料', deadline: '本周五', urgent: false },
];

const topAbilities = mockStudentAbilities.filter(a => a.level >= 4).slice(0, 5);

export default function StudentPortal() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>
          👋 你好，张三同学
        </Title>
        <Text type="secondary">欢迎回来，今天有 2 项待完成任务</Text>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <BookOutlined style={{ fontSize: 24, color: '#6366f1', marginBottom: 8 }} />
            <div className="stat-number">5</div>
            <Text type="secondary">在修课程</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <TrophyOutlined style={{ fontSize: 24, color: '#8b5cf6', marginBottom: 8 }} />
            <div className="stat-number">12</div>
            <Text type="secondary">已掌握能力</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <ThunderboltOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
            <div className="stat-number">78</div>
            <Text type="secondary">综合能力分</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <RocketOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <div className="stat-number">3</div>
            <Text type="secondary">推荐岗位</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Ability Radar */}
        <Col xs={24} lg={10}>
          <Card
            title={<><AimOutlined /> 能力图谱概览</>}
            bordered={false}
            className="card-hover"
            extra={<a onClick={() => navigate('/student/ability-graph')}>查看详情 →</a>}
          >
            <ReactEChartsCore
              echarts={echarts}
              option={radarOption}
              style={{ height: 300 }}
              notMerge
            />
            <div style={{ marginTop: 16 }}>
              {topAbilities.map(a => (
                <Tag key={a.id} color="purple" style={{ marginBottom: 4 }}>{a.label} Lv.{a.level}</Tag>
              ))}
            </div>
          </Card>
        </Col>

        {/* Recommended Paths */}
        <Col xs={24} lg={7}>
          <Card
            title={<><RocketOutlined /> 推荐学习路径</>}
            bordered={false}
            className="card-hover"
          >
            <List
              dataSource={recommendedPaths}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Text strong>{item.title}</Text>
                    <div style={{ margin: '4px 0' }}>
                      {item.tags.map(t => <Tag key={t} color="blue">{t}</Tag>)}
                    </div>
                    <Progress percent={item.progress} size="small" strokeColor="#6366f1" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Pending Tasks */}
        <Col xs={24} lg={7}>
          <Card
            title={<><ClockCircleOutlined /> 待完成任务</>}
            bordered={false}
            className="card-hover"
            extra={<a onClick={() => navigate('/student/practice')}>开始练习 →</a>}
          >
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Text strong>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.urgent ? <span style={{ color: '#ef4444' }}>紧急 · </span> : ''}{item.deadline}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
