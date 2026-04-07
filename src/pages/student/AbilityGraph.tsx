import { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Drawer, Tag, List, Upload, Segmented, Space, Select } from 'antd';
import { useLocation, useSearchParams } from 'react-router-dom';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { mockStudentAbilities, mockAbilityDetails } from '../../data/mockData';
import type { AbilityNode } from '../../types';

echarts.use([GraphChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

const abilityEdges = [
  { source: 'a1', target: 'a3', value: '支撑' },
  { source: 'a3', target: 'a4', value: '前置' },
  { source: 'a1', target: 'a6', value: '支撑' },
  { source: 'a6', target: 'a7', value: '前置' },
  { source: 'a5', target: 'a12', value: '支撑' },
  { source: 'a13', target: 'a12', value: '支撑' },
  { source: 'a3', target: 'a11', value: '支撑' },
  { source: 'a2', target: 'a12', value: '支撑' },
  { source: 'a8', target: 'a9', value: '关联' },
  { source: 'a9', target: 'a10', value: '进阶' },
  { source: 'a1', target: 'a15', value: '辅助' },
];

type CareerTarget = 'frontend-ai' | 'algorithm-ai' | 'data-mining';
type LocationState = { careerTarget?: CareerTarget };

const isCareerTarget = (value: unknown): value is CareerTarget => (
  value === 'frontend-ai' || value === 'algorithm-ai' || value === 'data-mining'
);

const highlightRoutesByTarget: Record<CareerTarget, string[][]> = {
  'frontend-ai': [
    ['a1', 'a6', 'a7'],
    ['a5', 'a12', 'a13'],
    ['a8', 'a9', 'a10'],
  ],
  'algorithm-ai': [
    ['a1', 'a3', 'a4'],
    ['a3', 'a11', 'a12'],
    ['a5', 'a12', 'a13'],
  ],
  'data-mining': [
    ['a2', 'a12', 'a13'],
    ['a1', 'a3', 'a4'],
    ['a8', 'a9', 'a10'],
  ],
};

function buildGraphOption(activeRoute: string[]) {
  const categories = [
    { name: '编程语言' },
    { name: '计算机基础' },
    { name: 'AI/数据' },
    { name: '软技能' },
    { name: '工程技能' },
    { name: '语言' },
  ];

  const categoryMap: Record<string, number> = {
    '编程语言': 0, '计算机基础': 1, 'AI/数据': 2, '软技能': 3, '工程技能': 4, '语言': 5,
  };

  const nodes = mockStudentAbilities.map((a) => ({
    isActive: activeRoute.includes(a.id),
    id: a.id,
    name: a.label,
    symbolSize: Math.max(30, a.level * 14) + (activeRoute.includes(a.id) ? 6 : 0),
    category: categoryMap[a.category] ?? 0,
    value: a.level,
    label: { show: true, fontSize: 11, color: activeRoute.includes(a.id) ? '#dbeafe' : '#9ca3af' },
    itemStyle: {
      color: activeRoute.includes(a.id)
        ? '#22d3ee'
        : a.level >= 4
          ? '#10b981'
          : a.level >= 2
            ? '#6366f1'
            : '#4b5563',
      borderColor: activeRoute.includes(a.id)
        ? '#67e8f9'
        : a.level >= 4
          ? '#059669'
          : a.level >= 2
            ? '#4f46e5'
            : '#6b7280',
      borderWidth: 2,
      shadowBlur: activeRoute.includes(a.id) ? 24 : 6,
      shadowColor: activeRoute.includes(a.id) ? 'rgba(34, 211, 238, 0.8)' : 'rgba(99, 102, 241, 0.2)',
    },
  }));

  const links = abilityEdges.map((e) => ({
    source: e.source,
    target: e.target,
    lineStyle: {
      color: activeRoute.includes(e.source) && activeRoute.includes(e.target) ? '#22d3ee' : '#818cf8',
      opacity: activeRoute.includes(e.source) && activeRoute.includes(e.target) ? 0.95 : 0.28,
      width: activeRoute.includes(e.source) && activeRoute.includes(e.target) ? 3.2 : 1.3,
      curveness: 0.2,
    },
    label: {
      show: false,
      formatter: e.value,
      fontSize: 10,
      color: '#9ca3af',
    },
  }));

  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const glowText = params.data.isActive ? '（动态点亮）' : '';
          return `<strong>${params.data.name}</strong>${glowText}<br/>等级: ${params.data.value}/5`;
        }
        return '';
      },
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderColor: '#38bdf8',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: categories.map(c => c.name),
      bottom: 10,
      textStyle: { fontSize: 12, color: '#cbd5e1' },
    },
    backgroundColor: '#0b1220',
    animationDuration: 900,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links,
        categories,
        roam: true,
        draggable: true,
        force: {
          repulsion: 250,
          gravity: 0.1,
          edgeLength: [120, 200],
        },
        lineStyle: {
          opacity: 0.5,
        },
        label: {
          position: 'right',
        },
        itemStyle: {
          opacity: 0.95,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4, color: '#67e8f9' },
        },
      },
    ],
  };
}

export default function AbilityGraph() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeState = location.state as LocationState | null;
  const targetFromQuery = searchParams.get('target');
  const initialTarget = isCareerTarget(targetFromQuery)
    ? targetFromQuery
    : (isCareerTarget(routeState?.careerTarget) ? routeState.careerTarget : 'algorithm-ai');
  const [selectedAbility, setSelectedAbility] = useState<AbilityNode | null>(null);
  const [careerTarget, setCareerTarget] = useState<CareerTarget>(initialTarget);
  const [routeIndex, setRouteIndex] = useState(0);
  const activeRoutes = highlightRoutesByTarget[careerTarget];

  useEffect(() => {
    setRouteIndex(0);
  }, [careerTarget]);

  useEffect(() => {
    if (isCareerTarget(routeState?.careerTarget)) {
      setCareerTarget(routeState.careerTarget);
    }
  }, [routeState?.careerTarget]);

  useEffect(() => {
    if (isCareerTarget(targetFromQuery)) {
      setCareerTarget(targetFromQuery);
    }
  }, [targetFromQuery]);

  useEffect(() => {
    const currentTarget = searchParams.get('target');
    if (currentTarget !== careerTarget) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('target', careerTarget);
      setSearchParams(nextParams, { replace: true });
    }
  }, [careerTarget, searchParams, setSearchParams]);

  const graphOption = useMemo(() => buildGraphOption(activeRoutes[routeIndex]), [activeRoutes, routeIndex]);

  const handleChartClick = (params: any) => {
    if (params.dataType === 'node') {
      const ability = mockStudentAbilities.find(a => a.id === params.data.id);
      setSelectedAbility(ability || null);
    }
  };

  const detail = selectedAbility ? mockAbilityDetails[selectedAbility.id] : null;

  return (
    <div>
      <div className="page-header">
        <Title level={3} style={{ marginBottom: 4 }}>🧠 我的能力图谱</Title>
        <Text type="secondary">动态点亮关键能力路径，点击任意能力节点查看详细信息</Text>
        <div style={{ marginTop: 12 }}>
          <Space direction="vertical" size={8}>
            <Text strong style={{ color: '#475569' }}>职业目标切换</Text>
            <Segmented
              value={careerTarget}
              onChange={(v) => setCareerTarget(v as CareerTarget)}
              options={[
                { label: '前端智能化开发', value: 'frontend-ai' },
                { label: '算法工程师', value: 'algorithm-ai' },
                { label: '数据挖掘工程师', value: 'data-mining' },
              ]}
            />
            <Space size={8}>
              <Text style={{ color: '#64748b' }}>高亮路径</Text>
              <Select
                value={routeIndex}
                style={{ width: 180 }}
                onChange={(value) => setRouteIndex(value)}
                options={activeRoutes.map((route, idx) => ({
                  value: idx,
                  label: `路径 ${idx + 1}（${route.length} 个能力点）`,
                }))}
              />
            </Space>
          </Space>
        </div>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.3)',
        }}
      >
        <ReactEChartsCore
          echarts={echarts}
          option={graphOption}
          style={{ height: 550 }}
          onEvents={{ click: handleChartClick }}
          notMerge
        />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          <Tag color="green" style={{ fontSize: 12 }}>🟢 已精通 (Lv.4-5)</Tag>
          <Tag color="blue" style={{ fontSize: 12 }}>🔵 进行中 (Lv.2-3)</Tag>
          <Tag color="cyan" style={{ fontSize: 12 }}>✨ 路径点亮中</Tag>
          <Tag color="default" style={{ fontSize: 12 }}>⚪ 待学习 (Lv.0-1)</Tag>
        </div>
      </Card>

      <Drawer
        title={selectedAbility?.label}
        placement="right"
        width={420}
        open={!!selectedAbility}
        onClose={() => setSelectedAbility(null)}
      >
        {selectedAbility && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="purple">{selectedAbility.category}</Tag>
              <Tag color={selectedAbility.level >= 4 ? 'green' : 'blue'}>
                等级 {selectedAbility.level}/{selectedAbility.maxLevel}
              </Tag>
            </div>

            <div style={{
              background: '#f5f3ff', borderRadius: 8, padding: 16, marginBottom: 16,
            }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>掌握程度</Text>
              </div>
              <div style={{
                height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(selectedAbility.level / selectedAbility.maxLevel) * 100}%`,
                  background: 'linear-gradient(90deg, #6366f1, #10b981)',
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            {detail && (
              <>
                <Title level={5}>能力描述</Title>
                <Paragraph type="secondary">{detail.description}</Paragraph>

                <Title level={5}>相关学习资源</Title>
                <List
                  size="small"
                  dataSource={detail.resources}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Tag color="blue">{item.type}</Tag>}
                        title={item.title}
                      />
                    </List.Item>
                  )}
                />
              </>
            )}

            <Title level={5} style={{ marginTop: 24 }}>佐证材料</Title>
            <Upload.Dragger
              listType="text"
              beforeUpload={() => false}
              multiple={false}
            >
              <p style={{ color: '#6366f1' }}>点击或拖拽文件到此区域上传</p>
              <Text type="secondary">支持证书、项目截图、成绩单等</Text>
            </Upload.Dragger>
          </div>
        )}
      </Drawer>
    </div>
  );
}
