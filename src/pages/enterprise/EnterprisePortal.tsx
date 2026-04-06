import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, List, Tag, Progress } from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UserAddOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Title, Text } = Typography;

const barOption = {
  tooltip: { trigger: 'axis' as const },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category' as const, data: ['前端工程师', '后端工程师', '算法工程师', '数据分析师', '产品经理'] },
  yAxis: { type: 'value' as const, name: '投递数' },
  series: [
    { name: '收到简历', type: 'bar', data: [45, 32, 28, 18, 15], itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] } },
    { name: '已面试', type: 'bar', data: [12, 8, 10, 5, 6], itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] } },
    { name: '已录用', type: 'bar', data: [3, 2, 4, 1, 2], itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] } },
  ],
};

const activeJobs = [
  { id: 'j1', title: '前端开发工程师', applicants: 45, interviewed: 12, status: '招聘中' },
  { id: 'j2', title: '后端开发工程师', applicants: 32, interviewed: 8, status: '招聘中' },
  { id: 'j3', title: '算法工程师', applicants: 28, interviewed: 10, status: '招聘中' },
];

const recommendedTalents = [
  { name: '李四', major: '软件工程', matchScore: 91, skills: ['React', 'TypeScript'] },
  { name: '张三', major: '计算机科学', matchScore: 85, skills: ['Python', '算法'] },
  { name: '郑十', major: '计算机科学', matchScore: 90, skills: ['Go', '微服务'] },
];

export default function EnterprisePortal() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>
          🏢 字节跳动 · 企业中心
        </Title>
        <Text type="secondary">正在招聘 3 个岗位，共收到 105 份简历</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <SearchOutlined style={{ fontSize: 24, color: '#6366f1', marginBottom: 8 }} />
            <div className="stat-number">3</div>
            <Text type="secondary">进行中招聘</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <FileTextOutlined style={{ fontSize: 24, color: '#8b5cf6', marginBottom: 8 }} />
            <div className="stat-number">105</div>
            <Text type="secondary">收到简历</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <UserAddOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 8 }} />
            <div className="stat-number">11</div>
            <Text type="secondary">推荐人才</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false}>
            <DollarOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
            <div className="stat-number">30</div>
            <Text type="secondary">面试完成</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recruitment Chart */}
        <Col xs={24} lg={12}>
          <Card title={<><RiseOutlined /> 招聘漏斗</>} bordered={false} className="card-hover">
            <ReactEChartsCore echarts={echarts} option={barOption} style={{ height: 320 }} notMerge />
          </Card>
        </Col>

        {/* Active Jobs */}
        <Col xs={24} lg={12}>
          <Card title="正在招聘" bordered={false} className="card-hover">
            <List
              dataSource={activeJobs}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{item.title}</Text>
                      <Tag color="green">{item.status}</Tag>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>投递: {item.applicants}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>面试: {item.interviewed}</Text>
                      <Progress
                        percent={Math.round((item.interviewed / item.applicants) * 100)}
                        size="small"
                        style={{ flex: 1, marginTop: 2 }}
                        strokeColor="#6366f1"
                      />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recommended Talents */}
      <Card
        title={<><TrophyOutlined /> AI推荐人才</>}
        bordered={false}
        className="card-hover"
        style={{ marginTop: 24 }}
        extra={<a onClick={() => navigate('/enterprise/talent-explorer')}>探索更多 →</a>}
      >
        <Row gutter={[16, 16]}>
          {recommendedTalents.map((talent) => (
            <Col xs={24} sm={8} key={talent.name}>
              <Card size="small" className="card-hover" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #c084fc)',
                    margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 18,
                  }}
                >
                  {talent.name[0]}
                </div>
                <Text strong>{talent.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{talent.major}</Text>
                <div style={{ margin: '8px 0 4px' }}>
                  <Tag color="purple">匹配度 {talent.matchScore}%</Tag>
                </div>
                <div>
                  {talent.skills.map(s => <Tag key={s} color="blue">{s}</Tag>)}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
