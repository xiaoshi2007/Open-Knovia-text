import { useMemo, useState } from 'react';
import { Card, Row, Col, Typography, Form, Input, Select, Button, Space, Tag, List, message } from 'antd';
import { FileDoneOutlined, RadarChartOutlined, CopyOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([RadarChart, RadarComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

type ResumeData = {
  candidateName: string;
  major: string;
  school: string;
  targetRole: string;
  highlights: string[];
  projectSummary: string;
  skillScores: number[];
};

const roleOptions = ['前端开发工程师', '后端开发工程师', '算法工程师', '数据分析师'];
const majorOptions = ['计算机科学', '软件工程', '人工智能', '数据科学'];
const dimensions = ['专业基础', '项目实战', '工程规范', '沟通协作', '学习成长', '岗位匹配'];

const roleTemplates: Record<string, Pick<ResumeData, 'highlights' | 'projectSummary' | 'skillScores'>> = {
  前端开发工程师: {
    highlights: ['熟悉 React + TypeScript', '具备组件化设计能力', '掌握前端性能优化方法'],
    projectSummary: '负责校园就业平台前端重构，完成组件拆分、性能优化与可视化看板开发，页面响应速度提升约 35%。',
    skillScores: [84, 88, 80, 78, 82, 86],
  },
  后端开发工程师: {
    highlights: ['掌握 Java/Go 服务开发', '具备数据库建模能力', '熟悉接口设计与压测'],
    projectSummary: '主导课程推荐服务 API 设计与落地，优化缓存策略并完善监控告警，核心接口平均响应下降 40%。',
    skillScores: [86, 82, 88, 76, 80, 84],
  },
  算法工程师: {
    highlights: ['掌握机器学习基础算法', '可独立完成特征工程', '具备模型评估与调优经验'],
    projectSummary: '参与简历智能评分模型训练，完成特征清洗、模型迭代与线上验证，AUC 提升至 0.89。',
    skillScores: [88, 84, 78, 74, 86, 90],
  },
  数据分析师: {
    highlights: ['熟悉 SQL 与数据建模', '具备 BI 可视化落地经验', '能够输出业务分析结论'],
    projectSummary: '搭建招聘漏斗分析看板，定位投递转化瓶颈并提出优化策略，面试转化率提升 12%。',
    skillScores: [82, 86, 76, 80, 84, 88],
  },
};

function buildRadarOption(data: ResumeData) {
  return {
    tooltip: {},
    radar: {
      indicator: dimensions.map((name) => ({ name, max: 100 })),
      radius: '65%',
      splitNumber: 5,
      splitArea: {
        areaStyle: {
          color: ['rgba(99,102,241,0.03)', 'rgba(99,102,241,0.06)', 'rgba(99,102,241,0.09)', 'rgba(99,102,241,0.12)', 'rgba(99,102,241,0.15)'],
        },
      },
    },
    legend: { data: ['候选人能力画像'] },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.skillScores,
            name: '候选人能力画像',
            lineStyle: { color: '#6366f1', width: 2 },
            areaStyle: { color: 'rgba(99,102,241,0.22)' },
            itemStyle: { color: '#6366f1' },
          },
        ],
      },
    ],
  };
}

export default function AbilityResumeGenerator() {
  const [form] = Form.useForm();
  const [resumeData, setResumeData] = useState<ResumeData>({
    candidateName: '李四',
    major: '软件工程',
    school: '华中科技大学',
    targetRole: '前端开发工程师',
    highlights: roleTemplates['前端开发工程师'].highlights,
    projectSummary: roleTemplates['前端开发工程师'].projectSummary,
    skillScores: roleTemplates['前端开发工程师'].skillScores,
  });

  const radarOption = useMemo(() => buildRadarOption(resumeData), [resumeData]);

  const handleRoleChange = (role: string) => {
    const template = roleTemplates[role];
    setResumeData((prev) => ({
      ...prev,
      targetRole: role,
      highlights: template.highlights,
      projectSummary: template.projectSummary,
      skillScores: template.skillScores,
    }));
    form.setFieldValue('projectSummary', template.projectSummary);
    message.info(`已切换到 ${role} 模板`);
  };

  const handleGenerate = (values: { candidateName: string; major: string; school: string; targetRole: string; projectSummary: string }) => {
    const template = roleTemplates[values.targetRole];
    setResumeData({
      candidateName: values.candidateName,
      major: values.major,
      school: values.school,
      targetRole: values.targetRole,
      highlights: template.highlights,
      projectSummary: values.projectSummary,
      skillScores: template.skillScores,
    });
    message.success('能力图谱简历已生成');
  };

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>
          <FileDoneOutlined /> 生成个人能力图谱简历
        </Title>
        <Text type="secondary">面向 HR 的候选人能力可视化简历页面，可一键生成岗位匹配版简历</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={9}>
          <Card bordered={false} className="card-hover" title="候选人信息配置">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                candidateName: resumeData.candidateName,
                major: resumeData.major,
                school: resumeData.school,
                targetRole: resumeData.targetRole,
                projectSummary: resumeData.projectSummary,
              }}
              onFinish={handleGenerate}
            >
              <Form.Item name="candidateName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入候选人姓名" />
              </Form.Item>
              <Form.Item name="school" label="院校" rules={[{ required: true, message: '请输入院校' }]}>
                <Input placeholder="请输入院校名称" />
              </Form.Item>
              <Form.Item name="major" label="专业" rules={[{ required: true, message: '请选择专业' }]}>
                <Select options={majorOptions.map((item) => ({ value: item, label: item }))} />
              </Form.Item>
              <Form.Item name="targetRole" label="目标岗位" rules={[{ required: true, message: '请选择目标岗位' }]}>
                <Select
                  options={roleOptions.map((item) => ({ value: item, label: item }))}
                  onChange={handleRoleChange}
                />
              </Form.Item>
              <Form.Item name="projectSummary" label="项目经历摘要" rules={[{ required: true, message: '请输入项目经历摘要' }]}>
                <Input.TextArea rows={4} placeholder="输入候选人在目标岗位相关的项目经历" />
              </Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  生成图谱简历
                </Button>
                <Button icon={<CopyOutlined />} onClick={() => message.success('已复制简历内容（示意）')}>
                  复制简历
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card bordered={false} className="card-hover" title={<><RadarChartOutlined /> 能力图谱预览</>}>
            <ReactEChartsCore echarts={echarts} option={radarOption} style={{ height: 360 }} notMerge />
          </Card>

          <Card
            bordered={false}
            className="card-hover"
            style={{ marginTop: 24 }}
            title={`${resumeData.candidateName} · 个人能力图谱简历`}
            extra={<Tag color="purple">{resumeData.targetRole}</Tag>}
          >
            <Paragraph style={{ marginBottom: 8 }}>
              <Text strong>院校/专业：</Text>
              {resumeData.school} · {resumeData.major}
            </Paragraph>
            <Paragraph style={{ marginBottom: 12 }}>
              <Text strong>岗位亮点：</Text>
            </Paragraph>
            <Space size={[8, 8]} wrap style={{ marginBottom: 16 }}>
              {resumeData.highlights.map((item) => (
                <Tag key={item} color="blue">
                  {item}
                </Tag>
              ))}
            </Space>
            <Paragraph style={{ marginBottom: 8 }}>
              <Text strong>项目经历摘要：</Text>
            </Paragraph>
            <Paragraph style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>{resumeData.projectSummary}</Paragraph>
            <Paragraph style={{ marginBottom: 8 }}>
              <Text strong>能力指标（0-100）：</Text>
            </Paragraph>
            <List
              size="small"
              dataSource={dimensions.map((dimension, idx) => ({ dimension, score: resumeData.skillScores[idx] }))}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.dimension}</Text>
                  <Text strong style={{ color: '#6366f1' }}>
                    {item.score}
                  </Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
