import { useEffect, useState } from 'react';
import { Card, Typography, Tag, Select, Input, Space, List, Avatar, Button, Drawer, Empty } from 'antd';
import { SearchOutlined, FilterOutlined, EnvironmentOutlined, BookOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { matchAPI } from '../../services/endpoints';
import { resumeAPI } from '../../services/endpoints';

echarts.use([ScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

const talentData = [
  { id: 's001', name: '张三', major: '计算机科学', skills: ['Python', 'React', '算法'], matchScore: 85, x: 3.2, y: 4.1 },
  { id: 's002', name: '李四', major: '软件工程', skills: ['React', 'TypeScript', 'Vue'], matchScore: 91, x: 4.5, y: 3.8 },
  { id: 's003', name: '王五', major: '数据科学', skills: ['Java', 'Go', 'MySQL'], matchScore: 78, x: 2.8, y: 3.5 },
  { id: 's004', name: '赵六', major: '人工智能', skills: ['PyTorch', 'TensorFlow', 'Python'], matchScore: 88, x: 3.8, y: 4.5 },
  { id: 's005', name: '孙七', major: '计算机科学', skills: ['C++', 'Linux', 'Docker'], matchScore: 72, x: 2.5, y: 2.8 },
  { id: 's006', name: '周八', major: '软件工程', skills: ['React', 'Node.js', 'MongoDB'], matchScore: 82, x: 3.5, y: 3.6 },
  { id: 's007', name: '吴九', major: '信息安全', skills: ['Python', '渗透测试', 'Linux'], matchScore: 76, x: 2.2, y: 3.0 },
  { id: 's008', name: '郑十', major: '计算机科学', skills: ['Go', 'Kubernetes', '微服务'], matchScore: 90, x: 4.2, y: 4.3 },
  { id: 's009', name: '陈一', major: '数据科学', skills: ['Python', 'Spark', 'Hadoop'], matchScore: 84, x: 3.0, y: 4.0 },
  { id: 's010', name: '林二', major: '软件工程', skills: ['Java', 'Spring', 'Vue'], matchScore: 70, x: 2.0, y: 2.5 },
  { id: 's011', name: '黄三', major: '人工智能', skills: ['TensorFlow', 'Python', 'R'], matchScore: 86, x: 3.6, y: 4.2 },
  { id: 's012', name: '杨四', major: '计算机科学', skills: ['Rust', 'WebAssembly', 'Go'], matchScore: 93, x: 4.8, y: 4.6 },
];

const skillOptions = ['Python', 'React', 'Java', 'Go', 'PyTorch', 'TensorFlow', 'Vue', 'Node.js', 'TypeScript', 'C++', 'Linux', 'Docker'];
const majorOptions = ['计算机科学', '软件工程', '数据科学', '人工智能', '信息安全'];
const jobOptions = [
  { value: 'j1', label: '前端开发工程师' },
  { value: 'j2', label: '后端开发工程师' },
  { value: 'j3', label: '算法工程师' },
];

function buildScatterOption(data: typeof talentData) {
  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        const d = data[params.dataIndex];
        return `<strong>${d.name}</strong><br/>专业: ${d.major}<br/>技能: ${d.skills.join(', ')}<br/>匹配度: ${d.matchScore}%`;
      },
    },
    grid: { left: '3%', right: '10%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { name: '工程能力', min: 1, max: 5, splitLine: { show: true, lineStyle: { type: 'dashed' as const } } },
    yAxis: { name: '学术能力', min: 1, max: 5, splitLine: { show: true, lineStyle: { type: 'dashed' as const } } },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => data[2] / 3,
        data: data.map(d => [d.x, d.y, d.matchScore]),
        itemStyle: {
          color: (params: any) => {
            const score = talentData[params.dataIndex]?.matchScore || 0;
            if (score >= 85) return '#10b981';
            if (score >= 75) return '#6366f1';
            return '#f59e0b';
          },
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.1)',
        },
        label: {
          show: true,
          formatter: (params: any) => talentData[params.dataIndex]?.name || '',
          position: 'top',
          fontSize: 11,
        },
      },
    ],
  };
}

export default function TalentExplorer() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [selectedJob, setSelectedJob] = useState('j1');
  const [reviewStatusMap, setReviewStatusMap] = useState<Record<string, 'pending' | 'reviewed' | 'second-review'>>({});
  const [resumeDrawerOpen, setResumeDrawerOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<(typeof talentData)[number] | null>(null);
  const [syncedResume, setSyncedResume] = useState<any>(null);

  const filteredData = talentData.filter((t) => {
    if (selectedSkills.length > 0 && !selectedSkills.some(s => t.skills.includes(s))) return false;
    if (selectedMajor && t.major !== selectedMajor) return false;
    if (searchText && !t.name.includes(searchText) && !t.skills.some(s => s.toLowerCase().includes(searchText.toLowerCase()))) return false;
    return true;
  });

  useEffect(() => {
    const loadReviewStatus = async () => {
      const nextMap: Record<string, 'pending' | 'reviewed' | 'second-review'> = {};
      await Promise.all(
        talentData.map(async (talent) => {
          const review = await matchAPI.getManualReview(talent.id, selectedJob);
          if (!review) {
            nextMap[talent.id] = 'pending';
            return;
          }
          const gap = Math.abs((review.aiScore || 0) - (review.manualScore || 0));
          nextMap[talent.id] = gap >= 15 ? 'second-review' : 'reviewed';
        })
      );
      setReviewStatusMap(nextMap);
    };
    loadReviewStatus();
  }, [selectedJob]);

  const getReviewTag = (talentId: string) => {
    const status = reviewStatusMap[talentId] || 'pending';
    if (status === 'second-review') return <Tag color="red">差异大需二审</Tag>;
    if (status === 'reviewed') return <Tag color="green">已复核</Tag>;
    return <Tag color="default">待复核</Tag>;
  };

  const openResumeDrawer = (talent: (typeof talentData)[number]) => {
    setSelectedTalent(talent);
    setSyncedResume(resumeAPI.get(talent.id));
    setResumeDrawerOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>🔭 人才图谱探索</Title>
        <Text type="secondary">基于能力图谱的多维人才发现，每个节点代表一位学生</Text>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Filter Panel */}
        <Card
          title={<><FilterOutlined /> 筛选条件</>}
          bordered={false}
          style={{ width: 280, flexShrink: 0, borderRadius: 12 }}
          size="small"
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>搜索</Text>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索姓名或技能..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>专业</Text>
            <Select
              allowClear
              placeholder="全部专业"
              value={selectedMajor}
              onChange={setSelectedMajor}
              style={{ width: '100%' }}
              options={majorOptions.map(m => ({ value: m, label: m }))}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>技能标签</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {skillOptions.map(s => (
                <Tag.CheckableTag
                  key={s}
                  checked={selectedSkills.includes(s)}
                  onChange={(checked) => {
                    setSelectedSkills(checked ? [...selectedSkills, s] : selectedSkills.filter(x => x !== s));
                  }}
                >
                  {s}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#f5f3ff', borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>筛选结果</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{filteredData.length}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>位匹配人才</Text>
          </div>
        </Card>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
            <ReactEChartsCore
              echarts={echarts}
              option={buildScatterOption(filteredData)}
              style={{ height: 400 }}
              notMerge
            />
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <Tag color="green">高匹配 (85%+)</Tag>
              <Tag color="blue">中匹配 (75-84%)</Tag>
              <Tag color="orange">待考察 (75%以下)</Tag>
            </div>
          </Card>

          <Card title="人才列表" bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">复核状态按岗位维度显示</Text>
              <Select
                value={selectedJob}
                onChange={setSelectedJob}
                options={jobOptions}
                style={{ width: 180 }}
                size="small"
              />
            </div>
            <List
              dataSource={filteredData.sort((a, b) => b.matchScore - a.matchScore)}
              renderItem={(talent) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          background: talent.matchScore >= 85
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : talent.matchScore >= 75
                              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                              : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        }}
                        size={48}
                      >
                        {talent.name[0]}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{talent.name}</Text>
                        <Tag color={talent.matchScore >= 85 ? 'green' : talent.matchScore >= 75 ? 'blue' : 'orange'}>
                          匹配度 {talent.matchScore}%
                        </Tag>
                        {getReviewTag(talent.id)}
                        {resumeAPI.get(talent.id) ? <Tag color="cyan">简历已同步</Tag> : <Tag>暂无同步简历</Tag>}
                      </div>
                    }
                    description={
                      <div>
                        <Space size={4}>
                          <BookOutlined style={{ fontSize: 12 }} />
                          <Text type="secondary">{talent.major}</Text>
                        </Space>
                        <div style={{ marginTop: 4 }}>
                          {talent.skills.map(s => <Tag key={s} style={{ fontSize: 11 }}>{s}</Tag>)}
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Button size="small" type="link" onClick={() => openResumeDrawer(talent)}>查看同步简历</Button>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>

      <Drawer
        title={selectedTalent ? `${selectedTalent.name} · 同步简历` : '同步简历'}
        placement="right"
        width={520}
        open={resumeDrawerOpen}
        onClose={() => setResumeDrawerOpen(false)}
      >
        {!syncedResume ? (
          <Empty description="该学生暂未同步简历" />
        ) : (
          <div>
            <Paragraph>
              <Text strong>目标岗位：</Text>{syncedResume.targetRole}
            </Paragraph>
            <Paragraph>
              <Text strong>院校专业：</Text>{syncedResume.school} · {syncedResume.major}
            </Paragraph>
            <Paragraph>
              <Text strong>个人简介：</Text>{syncedResume.summary}
            </Paragraph>
            <Paragraph>
              <Text strong>项目经历：</Text>
            </Paragraph>
            <List
              size="small"
              dataSource={syncedResume.projects || []}
              renderItem={(project: any) => (
                <List.Item>
                  <div>
                    <Text strong>{project.name}</Text>
                    <Tag color="blue" style={{ marginLeft: 8 }}>{project.role}</Tag>
                    <ul style={{ margin: '8px 0 8px 16px', padding: 0 }}>
                      {(project.highlights || []).map((h: string) => <li key={h}>{h}</li>)}
                    </ul>
                  </div>
                </List.Item>
              )}
            />
            <Paragraph>
              <Text strong>能力维度：</Text>
            </Paragraph>
            <Space wrap>
              {(syncedResume.dimensions || []).map((d: any) => (
                <Tag color="purple" key={d.name}>{d.name}: {d.score}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
}
