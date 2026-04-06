import { useState } from 'react';
import { Card, Select, Row, Col, Typography, Tag, Divider, Progress, Space, Button } from 'antd';
import {
  SwapOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

const jobs = [
  { id: 'j1', title: '前端开发工程师', company: '字节跳动', salary: '20K-35K', location: '北京' },
  { id: 'j2', title: '后端开发工程师', company: '字节跳动', salary: '25K-40K', location: '北京' },
  { id: 'j3', title: '算法工程师', company: '腾讯科技', salary: '30K-50K', location: '深圳' },
];

const students = [
  { id: 's001', name: '张三', major: '计算机科学' },
  { id: 's002', name: '李四', major: '软件工程' },
  { id: 's003', name: '王五', major: '数据科学' },
  { id: 's004', name: '赵六', major: '人工智能' },
  { id: 's008', name: '郑十', major: '计算机科学' },
];

// Mock comparison data for each job-student pair
const getComparison = (jobId: string, studentId: string) => {
  const key = `${jobId}_${studentId}`;
  const defaultResult = {
    indicators: [{ name: '能力A', max: 5 }, { name: '能力B', max: 5 }, { name: '能力C', max: 5 }],
    jobValues: [3, 4, 3],
    studentValues: [2, 4, 2],
    comparisons: [
      { ability: '能力A', required: 3, actual: 2, matched: false },
      { ability: '能力B', required: 4, actual: 4, matched: true },
      { ability: '能力C', required: 3, actual: 2, matched: false },
    ],
    score: 55,
  };

  const data: Record<string, typeof defaultResult> = {
    'j1_s001': {
      indicators: [{ name: 'React/Vue', max: 5 }, { name: 'TypeScript', max: 5 }, { name: 'CSS/HTML', max: 5 }, { name: '算法', max: 5 }, { name: 'Git', max: 5 }],
      jobValues: [4, 3, 4, 3, 3],
      studentValues: [3, 3, 3, 4, 4],
      comparisons: [
        { ability: '前端开发', required: 3, actual: 3, matched: true },
        { ability: 'TypeScript', required: 3, actual: 3, matched: true },
        { ability: '算法设计', required: 3, actual: 4, matched: true },
        { ability: 'Git版本控制', required: 2, actual: 4, matched: true },
      ],
      score: 85,
    },
    'j2_s001': {
      indicators: [{ name: '后端开发', max: 5 }, { name: '数据库', max: 5 }, { name: '系统设计', max: 5 }, { name: 'Linux', max: 5 }, { name: '算法', max: 5 }],
      jobValues: [4, 3, 3, 3, 4],
      studentValues: [4, 3, 2, 3, 4],
      comparisons: [
        { ability: '后端开发', required: 3, actual: 4, matched: true },
        { ability: '数据库', required: 3, actual: 3, matched: true },
        { ability: '系统设计', required: 3, actual: 2, matched: false },
        { ability: 'Linux', required: 2, actual: 3, matched: true },
      ],
      score: 72,
    },
    'j3_s004': {
      indicators: [{ name: '机器学习', max: 5 }, { name: '深度学习', max: 5 }, { name: 'Python', max: 5 }, { name: '算法', max: 5 }, { name: '数学', max: 5 }],
      jobValues: [4, 3, 4, 4, 4],
      studentValues: [4, 4, 5, 4, 3],
      comparisons: [
        { ability: '机器学习', required: 4, actual: 4, matched: true },
        { ability: '深度学习', required: 2, actual: 4, matched: true },
        { ability: 'Python编程', required: 3, actual: 5, matched: true },
        { ability: '算法设计', required: 4, actual: 4, matched: true },
      ],
      score: 96,
    },
  };

  return data[key] || defaultResult;
};

export default function JobMatchAnalysis() {
  const [selectedJob, setSelectedJob] = useState('j1');
  const [selectedStudent, setSelectedStudent] = useState('s001');

  const comp = getComparison(selectedJob, selectedStudent);

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: comp.indicators,
      shape: 'circle' as const,
      splitNumber: 5,
      axisName: { color: '#6b7280', fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(99,102,241,0.02)', 'rgba(99,102,241,0.04)', 'rgba(99,102,241,0.06)', 'rgba(99,102,241,0.08)', 'rgba(99,102,241,0.1)'] } },
      splitLine: { lineStyle: { color: '#e5e7eb' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: comp.jobValues,
            name: '岗位要求',
            areaStyle: { color: 'rgba(239, 68, 68, 0.15)' },
            lineStyle: { color: '#ef4444', width: 2, type: 'dashed' as const },
            itemStyle: { color: '#ef4444' },
          },
          {
            value: comp.studentValues,
            name: '学生能力',
            areaStyle: { color: 'rgba(99, 102, 241, 0.2)' },
            lineStyle: { color: '#6366f1', width: 2 },
            itemStyle: { color: '#6366f1' },
          },
        ],
      },
    ],
    legend: {
      data: ['岗位要求', '学生能力'],
      bottom: 0,
    },
  };

  const getScoreColor = () => {
    if (comp.score >= 80) return '#10b981';
    if (comp.score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const matchedCount = comp.comparisons.filter(c => c.matched).length;

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>⚡ 人岗匹配分析</Title>
        <Text type="secondary">对比岗位能力要求与学生实际能力，智能计算匹配度</Text>
      </div>

      {/* Selector */}
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={10}>
            <Space style={{ width: '100%' }}>
              <SolutionOutlined style={{ fontSize: 20, color: '#6366f1' }} />
              <Select
                value={selectedJob}
                onChange={setSelectedJob}
                style={{ flex: 1 }}
                options={jobs.map(j => ({
                  value: j.id,
                  label: `${j.title} - ${j.company}`,
                }))}
              />
            </Space>
          </Col>
          <Col xs={24} md={4} style={{ textAlign: 'center' }}>
            <SwapOutlined style={{ fontSize: 24, color: '#6366f1' }} />
          </Col>
          <Col xs={24} md={10}>
            <Space style={{ width: '100%' }}>
              <UserOutlined style={{ fontSize: 20, color: '#8b5cf6' }} />
              <Select
                value={selectedStudent}
                onChange={setSelectedStudent}
                style={{ flex: 1 }}
                options={students.map(s => ({
                  value: s.id,
                  label: `${s.name} - ${s.major}`,
                }))}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* Match Score */}
        <Col xs={24} lg={8}>
          <Card bordered={false} className="card-hover" style={{ borderRadius: 12, textAlign: 'center', padding: '20px 0' }}>
            <TrophyOutlined style={{ fontSize: 40, color: getScoreColor(), marginBottom: 12 }} />
            <div style={{ fontSize: 56, fontWeight: 800, color: getScoreColor() }}>{comp.score}</div>
            <Text type="secondary" style={{ fontSize: 16 }}>匹配度分数</Text>
            <Divider />
            <div style={{ textAlign: 'left', padding: '0 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>匹配能力项</Text>
                <Text strong style={{ color: '#10b981' }}>{matchedCount}/{comp.comparisons.length}</Text>
              </div>
              <Progress
                percent={Math.round((matchedCount / comp.comparisons.length) * 100)}
                strokeColor="#10b981"
                showInfo={false}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5}>能力对比明细</Title>
              {comp.comparisons.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text>{c.ability}</Text>
                  <Space>
                    <Text type="secondary">需 {c.required}</Text>
                    <Text>实 {c.actual}</Text>
                    {c.matched
                      ? <CheckCircleOutlined style={{ color: '#10b981' }} />
                      : <CloseCircleOutlined style={{ color: '#ef4444' }} />
                    }
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Radar Chart */}
        <Col xs={24} lg={16}>
          <Card
            title="能力图谱对比"
            bordered={false}
            className="card-hover"
            style={{ borderRadius: 12 }}
            extra={
              <Space>
                <Tag color="red">- - 岗位要求</Tag>
                <Tag color="blue">—— 学生能力</Tag>
              </Space>
            }
          >
            <ReactEChartsCore
              echarts={echarts}
              option={radarOption}
              style={{ height: 400 }}
              notMerge
            />
          </Card>

          <Card bordered={false} className="card-hover" style={{ marginTop: 24, borderRadius: 12 }}>
            <Title level={5}>💡 AI匹配建议</Title>
            <Row gutter={16}>
              {comp.comparisons.filter(c => !c.matched).map((c, idx) => (
                <Col xs={24} sm={12} key={idx}>
                  <Card size="small" style={{ background: '#fef2f2', border: 'none', borderRadius: 8, marginBottom: 8 }}>
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ef4444' }} />
                      <div>
                        <Text strong>{c.ability}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          当前 Lv.{c.actual}，需达到 Lv.{c.required}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
              <Col span={24}>
                <Button type="primary" block style={{ marginTop: 8 }}>
                  生成个性化提升方案
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
