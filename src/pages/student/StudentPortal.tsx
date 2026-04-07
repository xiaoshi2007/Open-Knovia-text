import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Progress, Tag, Typography, List, Steps, Space, Segmented, Button, Drawer, Divider, Input, Select, Slider, Empty } from 'antd';
import {
  BookOutlined,
  AimOutlined,
  FileTextOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { mockStudentAbilities } from '../../data/mockData';
import { mockCourses } from '../../data/mockData';
import { mockQuestions } from '../../data/mockData';
import type { Question } from '../../types';

echarts.use([RadarChart, RadarComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;
type CareerTarget = 'frontend-ai' | 'algorithm-ai' | 'data-mining';

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

const careerPlanSteps = [
  { title: '目标岗位', description: 'AI 算法工程师（校招）' },
  { title: '能力差距', description: '系统设计、深度学习工程化' },
  { title: '阶段行动', description: '6 周完成 2 个项目 + 1 次模拟面试' },
  { title: '里程碑', description: '本月达成岗位匹配度 82%' },
];

const careerPlanStepByTarget: Record<CareerTarget, typeof careerPlanSteps> = {
  'frontend-ai': [
    { title: '目标岗位', description: '前端智能化开发工程师（校招）' },
    { title: '能力差距', description: '可视化性能、智能交互设计' },
    { title: '阶段行动', description: '4 周完成 2 个前端 AI 项目 Demo' },
    { title: '里程碑', description: '本月达成岗位匹配度 80%' },
  ],
  'algorithm-ai': careerPlanSteps,
  'data-mining': [
    { title: '目标岗位', description: '数据挖掘工程师（校招）' },
    { title: '能力差距', description: 'A/B 实验设计、特征工程' },
    { title: '阶段行动', description: '6 周完成 1 个用户增长分析项目' },
    { title: '里程碑', description: '本月达成岗位匹配度 85%' },
  ],
};

const jobRecommendations = [
  { name: '算法工程师（NLP）', match: 78, gap: ['模型部署', '工程规范'] },
  { name: '数据挖掘工程师', match: 84, gap: ['A/B 实验', '数据治理'] },
  { name: '前端智能化开发', match: 72, gap: ['可视化性能', 'Prompt 工程'] },
];

const topAbilities = mockStudentAbilities.filter(a => a.level >= 4).slice(0, 5);

export default function StudentPortal() {
  const navigate = useNavigate();
  const [careerTarget, setCareerTarget] = useState<CareerTarget>('algorithm-ai');
  const currentCareerSteps = careerPlanStepByTarget[careerTarget];
  const abilityGraphPath = `/student/ability-graph?target=${careerTarget}`;
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selfStudyPrompt, setSelfStudyPrompt] = useState('');
  const [selfStudyDifficulty, setSelfStudyDifficulty] = useState<number>(3);
  const [selfStudyType, setSelfStudyType] = useState<Question['type']>('single');
  const [selfStudyCount, setSelfStudyCount] = useState<number>(5);
  const [selfStudyQuestions, setSelfStudyQuestions] = useState<Question[]>([]);

  const courseProgressMap: Record<string, number> = {
    c001: 62,
    c002: 38,
  };

  const courseViewData = useMemo(
    () => mockCourses.map((course) => ({
      ...course,
      progress: courseProgressMap[course.id] ?? 0,
      nextChapter: course.chapters.find((_, idx) => idx === Math.floor(((courseProgressMap[course.id] ?? 0) / 100) * course.chapters.length))
        || course.chapters[course.chapters.length - 1],
    })),
    [],
  );

  const selectedCourse = courseViewData.find((c) => c.id === selectedCourseId) || null;
  const abilityRadarForStudy = useMemo(() => ({
    ...radarOption,
    radar: {
      ...radarOption.radar,
      axisName: { color: '#475569', fontSize: 12 },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [4, 5, 4, 3, 3, 4, 4, 5],
        name: '学习能力画像',
        areaStyle: { color: 'rgba(99,102,241,0.18)' },
        lineStyle: { color: '#4f46e5', width: 2 },
        itemStyle: { color: '#4f46e5' },
      }],
    }],
  }), []);

  const getAbilityColor = (level: number) => {
    if (level >= 4) return `rgba(22, 163, 74, ${0.4 + level * 0.12})`;
    return `rgba(220, 38, 38, ${0.45 + (5 - level) * 0.1})`;
  };

  const generateSelfStudyQuestions = () => {
    const keyword = selfStudyPrompt.trim().toLowerCase();
    const byType = mockQuestions.filter((q) => q.type === selfStudyType);
    const byDifficulty = byType.filter((q) => Math.abs(q.difficulty - selfStudyDifficulty) <= 1);
    const byPrompt = keyword
      ? byDifficulty.filter((q) => (
          q.content.toLowerCase().includes(keyword)
          || q.tags.some((t) => t.toLowerCase().includes(keyword))
        ))
      : byDifficulty;
    const fallback = byDifficulty.length > 0 ? byDifficulty : byType;
    const chosen = (byPrompt.length > 0 ? byPrompt : fallback).slice(0, selfStudyCount);
    setSelfStudyQuestions(chosen);
  };

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
        <Col xs={24} sm={6}>
          <Card className="stat-card" bordered={false} hoverable onClick={() => navigate('/student/resume')}>
            <FileTextOutlined style={{ fontSize: 24, color: '#06b6d4', marginBottom: 8 }} />
            <div className="stat-number">1</div>
            <Text type="secondary">个人简历档案</Text>
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
            extra={<a onClick={() => navigate(abilityGraphPath, { state: { careerTarget } })}>查看详情 →</a>}
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

        {/* Career Planning */}
        <Col xs={24}>
          <Card
            title={<><CompassOutlined /> 职业规划引擎</>}
            bordered={false}
            className="card-hover"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={11}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>职业发展路线图</Text>
                <Segmented
                  value={careerTarget}
                  onChange={(v) => setCareerTarget(v as CareerTarget)}
                  options={[
                    { label: '前端智能化开发', value: 'frontend-ai' },
                    { label: '算法工程师', value: 'algorithm-ai' },
                    { label: '数据挖掘工程师', value: 'data-mining' },
                  ]}
                  style={{ marginBottom: 14 }}
                />
                <Steps
                  direction="vertical"
                  size="small"
                  current={2}
                  items={currentCareerSteps}
                />
                <Button
                  type="primary"
                  style={{ marginTop: 14 }}
                  onClick={() => navigate(abilityGraphPath, { state: { careerTarget } })}
                >
                  在能力图谱中查看目标路径
                </Button>
              </Col>
              <Col xs={24} lg={13}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>岗位匹配度与能力缺口</Text>
                <List
                  dataSource={jobRecommendations}
                  renderItem={(job) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Text strong>{job.name}</Text>
                          <Tag color={job.match >= 80 ? 'green' : 'blue'}>匹配度 {job.match}%</Tag>
                        </Space>
                        <Progress
                          percent={job.match}
                          size="small"
                          strokeColor={{ '0%': '#6366f1', '100%': '#06b6d4' }}
                          style={{ margin: '8px 0 6px' }}
                        />
                        <div>
                          {job.gap.map((g) => (
                            <Tag key={`${job.name}-${g}`} color="purple">
                              待补齐: {g}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* My Courses */}
        <Col xs={24}>
          <Card
            title={<><BookOutlined /> 我的课程</>}
            bordered={false}
            className="card-hover"
          >
            <List
              dataSource={courseViewData}
              renderItem={(course) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <Text strong>{course.name}</Text>
                        <div>
                          <Text type="secondary">{course.description}</Text>
                        </div>
                      </div>
                      <Tag color={course.progress >= 60 ? 'green' : 'blue'}>
                        进度 {course.progress}%
                      </Tag>
                    </Space>
                    <Progress
                      percent={course.progress}
                      size="small"
                      strokeColor={{ '0%': '#6366f1', '100%': '#22d3ee' }}
                      style={{ margin: '10px 0 8px' }}
                    />
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text type="secondary">下一章节：{course.nextChapter?.name || '课程已完成'}</Text>
                      <Space>
                        <Button size="small" onClick={() => setSelectedCourseId(course.id)}>课程详情</Button>
                        <Button size="small" type="primary" onClick={() => navigate('/student/practice')}>
                          继续学习
                        </Button>
                      </Space>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Self Study Module */}
        <Col xs={24}>
          <Card title="学生自学模块 · 自然语言出题" bordered={false} className="card-hover">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card size="small" bordered={false} style={{ background: '#f8fafc' }}>
                  <Text strong>自然语言提问</Text>
                  <Input.TextArea
                    rows={3}
                    placeholder="例如：请围绕图论最短路径出5道中等难度单选题"
                    value={selfStudyPrompt}
                    onChange={(e) => setSelfStudyPrompt(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                  <Space style={{ marginTop: 10 }}>
                    <div>
                      <Text type="secondary">题型</Text>
                      <Select
                        style={{ width: 120, display: 'block' }}
                        value={selfStudyType}
                        onChange={(v) => setSelfStudyType(v)}
                        options={[
                          { label: '单选', value: 'single' },
                          { label: '多选', value: 'multiple' },
                        ]}
                      />
                    </div>
                    <div>
                      <Text type="secondary">难度</Text>
                      <Slider
                        min={1}
                        max={5}
                        value={selfStudyDifficulty}
                        onChange={(v) => setSelfStudyDifficulty(v)}
                        style={{ width: 150 }}
                      />
                    </div>
                    <div>
                      <Text type="secondary">题量</Text>
                      <Select
                        style={{ width: 90, display: 'block' }}
                        value={selfStudyCount}
                        onChange={(v) => setSelfStudyCount(v)}
                        options={[3, 5, 8, 10].map((n) => ({ label: `${n}题`, value: n }))}
                      />
                    </div>
                  </Space>
                  <Button type="primary" style={{ marginTop: 12 }} onClick={generateSelfStudyQuestions}>
                    立即生成练习题
                  </Button>
                </Card>

                <Card size="small" title="生成题目预览" style={{ marginTop: 12 }}>
                  {selfStudyQuestions.length === 0 ? (
                    <Empty description="暂无题目，先设置条件并点击“立即生成练习题”" />
                  ) : (
                    <>
                      <List
                        size="small"
                        dataSource={selfStudyQuestions}
                        renderItem={(q, idx) => (
                          <List.Item>
                            <div>
                              <Text strong>{idx + 1}. {q.content}</Text>
                              <div style={{ marginTop: 4 }}>
                                <Tag color="blue">{q.type === 'single' ? '单选' : '多选'}</Tag>
                                <Tag color={q.difficulty >= 4 ? 'red' : q.difficulty >= 3 ? 'blue' : 'green'}>难度 {q.difficulty}</Tag>
                                {q.tags.map((t) => <Tag key={`${q.id}-${t}`}>{t}</Tag>)}
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                      <Button
                        type="primary"
                        block
                        onClick={() => navigate('/student/practice', { state: { customQuestions: selfStudyQuestions } })}
                      >
                        使用这些题目开始练习
                      </Button>
                    </>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card size="small" title="个人能力图谱（薄弱红 / 擅长绿，颜色深浅代表掌握程度）">
                  <ReactEChartsCore echarts={echarts} option={abilityRadarForStudy} style={{ height: 320 }} notMerge />
                  <Space wrap style={{ marginTop: 8 }}>
                    {mockStudentAbilities.map((a) => (
                      <Tag
                        key={a.id}
                        style={{
                          background: getAbilityColor(a.level),
                          color: '#fff',
                          border: 'none',
                          marginBottom: 6,
                        }}
                      >
                        {a.label} Lv.{a.level}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Drawer
        title={selectedCourse?.name || '课程详情'}
        placement="right"
        width={460}
        open={!!selectedCourse}
        onClose={() => setSelectedCourseId(null)}
      >
        {selectedCourse && (
          <div>
            <Paragraph>
              <Text strong>课程简介：</Text>{selectedCourse.description}
            </Paragraph>
            <Paragraph>
              <Text strong>学习进度：</Text>{selectedCourse.progress}%
            </Paragraph>
            <Progress percent={selectedCourse.progress} strokeColor="#6366f1" />
            <Divider />
            <Title level={5}>章节计划</Title>
            <List
              size="small"
              dataSource={selectedCourse.chapters}
              renderItem={(chapter, idx) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{idx + 1}. {chapter.name}</Text>
                    <Tag color={idx < Math.floor((selectedCourse.progress / 100) * selectedCourse.chapters.length) ? 'green' : 'default'}>
                      {idx < Math.floor((selectedCourse.progress / 100) * selectedCourse.chapters.length) ? '已完成' : '待学习'}
                    </Tag>
                  </Space>
                </List.Item>
              )}
            />
            <Button type="primary" block style={{ marginTop: 14 }} onClick={() => navigate('/student/practice')}>
              进入章节练习
            </Button>
          </div>
        )}
      </Drawer>

    </div>
  );
}
