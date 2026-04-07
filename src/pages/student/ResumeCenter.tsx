import { useMemo, useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Space, Tag, List, Button, Divider, message } from 'antd';
import { UserOutlined, PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { resumeAPI } from '../../services/endpoints';
import { mockStudentAbilities } from '../../data/mockData';

echarts.use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

type ResumeProfile = {
  studentId: string;
  name: string;
  major: string;
  school: string;
  phone: string;
  email: string;
  location: string;
  targetRole: string;
  expectedSalary: string;
  summary: string;
  education: { degree: string; period: string; details: string }[];
  experiences: { company: string; role: string; period: string; details: string[] }[];
  projects: { name: string; role: string; highlights: string[]; stack: string[] }[];
  certificates: string[];
  awards: string[];
  languages: string[];
  dimensions: { name: string; score: number }[];
};

const defaultResume: ResumeProfile = {
  studentId: 's001',
  name: '张三',
  major: '计算机科学与技术',
  school: '华中科技大学',
  phone: '138-0000-1234',
  email: 'zhangsan@example.com',
  location: '武汉',
  targetRole: '算法工程师',
  expectedSalary: '20K-30K',
  summary: '具备扎实的计算机基础与算法能力，拥有课程平台智能推荐和招聘匹配相关项目经验，擅长将模型能力与工程落地结合。',
  education: [
    { degree: '本科 · 计算机科学与技术', period: '2022.09 - 2026.06', details: 'GPA 3.7/4.0，核心课程：数据结构、算法设计、机器学习、数据库系统' },
  ],
  experiences: [
    {
      company: '某科技公司（实习）',
      role: '算法研发实习生',
      period: '2025.07 - 2025.10',
      details: [
        '参与简历匹配模型特征工程，构建 20+ 结构化特征并完成验证',
        '优化离线评估脚本，缩短评测耗时约 35%',
        '配合后端上线评分接口，推动模型版本迭代',
      ],
    },
  ],
  projects: [
    {
      name: '智能就业推荐平台',
      role: '算法与后端开发',
      highlights: [
        '实现候选人能力图谱建模与人岗匹配评分逻辑',
        '设计基于规则+模型的综合打分机制',
        '支持能力雷达与岗位推荐可视化展示',
      ],
      stack: ['Python', 'FastAPI', 'MySQL', 'ECharts'],
    },
    {
      name: '课程学习路径推荐系统',
      role: '数据建模',
      highlights: [
        '基于学习行为数据构建个性化推荐策略',
        '提供学习路径动态调整与阶段反馈',
      ],
      stack: ['Python', 'Pandas', 'Scikit-learn'],
    },
  ],
  certificates: ['CET-6', '全国大学生数学建模竞赛省二等奖', '阿里云 ACA 证书'],
  awards: ['校一等奖学金（2次）', '优秀学生干部', '蓝桥杯省赛二等奖'],
  languages: ['英语（CET-6）', '普通话（二甲）'],
  dimensions: [
    { name: '专业基础', score: 88 },
    { name: '算法能力', score: 90 },
    { name: '工程落地', score: 84 },
    { name: '项目管理', score: 80 },
    { name: '沟通协作', score: 86 },
    { name: '创新成长', score: 89 },
  ],
};

function buildRadarOption(dimensions: ResumeProfile['dimensions']) {
  return {
    tooltip: {},
    radar: {
      indicator: dimensions.map((d) => ({ name: d.name, max: 100 })),
      radius: '60%',
      splitNumber: 5,
      splitArea: {
        areaStyle: {
          color: ['rgba(56,189,248,0.04)', 'rgba(56,189,248,0.08)', 'rgba(56,189,248,0.12)', 'rgba(56,189,248,0.16)', 'rgba(56,189,248,0.2)'],
        },
      },
      axisName: { color: '#cbd5e1' },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.4)' } },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.35)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dimensions.map((d) => d.score),
            name: '多维能力画像',
            areaStyle: { color: 'rgba(34,211,238,0.28)' },
            lineStyle: { color: '#22d3ee', width: 2.5 },
            itemStyle: { color: '#67e8f9' },
          },
        ],
      },
    ],
  };
}

export default function ResumeCenter() {
  const [resume, setResume] = useState<ResumeProfile>(() => resumeAPI.get('s001') || defaultResume);
  const radarOption = useMemo(() => buildRadarOption(resume.dimensions), [resume.dimensions]);
  const topAbilities = mockStudentAbilities.filter((a) => a.level >= 4).slice(0, 8);

  const handleSave = () => {
    resumeAPI.save(resume);
    message.success('简历已同步，HR 端可查看最新版本');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>📄 个人简历中心</Title>
        <Text type="secondary">多维能力、项目经历、岗位画像一体化，支持 HR 端同步与纸质简历导出</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={9}>
          <Card bordered={false} className="card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Tag color="blue">已与 HR 同步</Tag>
              <Space>
                <Button icon={<SaveOutlined />} onClick={handleSave}>同步简历</Button>
                <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>导出纸质简历</Button>
              </Space>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <Avatar size={84} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }} />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>{resume.name}</Title>
              <Text type="secondary">{resume.school} · {resume.major}</Text>
              <div style={{ marginTop: 10 }}>
                <Tag color="purple">{resume.targetRole}</Tag>
                <Tag color="cyan">期望 {resume.expectedSalary}</Tag>
              </div>
            </div>
            <Paragraph>{resume.summary}</Paragraph>
            <Divider style={{ margin: '12px 0' }} />
            <List
              size="small"
              dataSource={[
                `电话：${resume.phone}`,
                `邮箱：${resume.email}`,
                `地区：${resume.location}`,
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card
            bordered={false}
            className="card-hover"
            title="多维能力雷达图"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)' }}
            headStyle={{ color: '#e2e8f0' }}
          >
            <ReactEChartsCore echarts={echarts} option={radarOption} style={{ height: 360 }} notMerge />
            <div style={{ textAlign: 'center', marginTop: -220, marginBottom: 180, pointerEvents: 'none' }}>
              <Avatar size={68} icon={<UserOutlined />} style={{ background: 'rgba(14,165,233,0.9)', boxShadow: '0 0 24px rgba(34,211,238,0.8)' }} />
              <div style={{ color: '#bae6fd', marginTop: 8, fontWeight: 600 }}>个人能力核心</div>
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card bordered={false} className="card-hover" title="完整简历信息（HR 同步视图）">
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={12}>
                <Title level={5}>教育背景</Title>
                <List
                  size="small"
                  dataSource={resume.education}
                  renderItem={(item) => (
                    <List.Item>
                      <div>
                        <Text strong>{item.degree}</Text>
                        <div><Text type="secondary">{item.period}</Text></div>
                        <div>{item.details}</div>
                      </div>
                    </List.Item>
                  )}
                />
                <Title level={5} style={{ marginTop: 16 }}>实习/实践经历</Title>
                <List
                  size="small"
                  dataSource={resume.experiences}
                  renderItem={(exp) => (
                    <List.Item>
                      <div>
                        <Text strong>{exp.company} · {exp.role}</Text>
                        <div><Text type="secondary">{exp.period}</Text></div>
                        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                          {exp.details.map((d) => <li key={d}>{d}</li>)}
                        </ul>
                      </div>
                    </List.Item>
                  )}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Title level={5}>项目经历</Title>
                <List
                  size="small"
                  dataSource={resume.projects}
                  renderItem={(project) => (
                    <List.Item>
                      <div>
                        <Text strong>{project.name}</Text>
                        <Tag style={{ marginLeft: 8 }} color="blue">{project.role}</Tag>
                        <ul style={{ margin: '8px 0 8px 16px', padding: 0 }}>
                          {project.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                        <Space wrap>{project.stack.map((t) => <Tag key={t}>{t}</Tag>)}</Space>
                      </div>
                    </List.Item>
                  )}
                />
                <Title level={5} style={{ marginTop: 16 }}>证书与荣誉</Title>
                <Space wrap>{resume.certificates.map((c) => <Tag color="gold" key={c}>{c}</Tag>)}</Space>
                <div style={{ marginTop: 10 }}>
                  <Space wrap>{resume.awards.map((a) => <Tag color="purple" key={a}>{a}</Tag>)}</Space>
                </div>
                <Title level={5} style={{ marginTop: 16 }}>语言与优势能力</Title>
                <Space wrap>{resume.languages.map((l) => <Tag color="cyan" key={l}>{l}</Tag>)}</Space>
                <div style={{ marginTop: 10 }}>
                  <Space wrap>
                    {topAbilities.map((a) => <Tag key={a.id} color="green">{a.label} Lv.{a.level}</Tag>)}
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
