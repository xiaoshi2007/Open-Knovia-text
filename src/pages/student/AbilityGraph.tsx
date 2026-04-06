import { useState } from 'react';
import { Card, Typography, Drawer, Tag, Button, List, Upload, Empty } from 'antd';
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

function buildGraphOption() {
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
    id: a.id,
    name: a.label,
    symbolSize: Math.max(30, a.level * 14),
    category: categoryMap[a.category] ?? 0,
    value: a.level,
    label: { show: true, fontSize: 11, color: '#374151' },
    itemStyle: {
      color: a.level >= 4 ? '#10b981' : a.level >= 2 ? '#6366f1' : '#d1d5db',
      borderColor: a.level >= 4 ? '#059669' : a.level >= 2 ? '#4f46e5' : '#9ca3af',
      borderWidth: 2,
    },
  }));

  const links = abilityEdges.map((e) => ({
    source: e.source,
    target: e.target,
    lineStyle: { color: '#a5b4fc', width: 1.5, curveness: 0.2 },
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
          return `<strong>${params.data.name}</strong><br/>等级: ${params.data.value}/5`;
        }
        return '';
      },
    },
    legend: {
      data: categories.map(c => c.name),
      bottom: 10,
      textStyle: { fontSize: 12 },
    },
    animationDuration: 1500,
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
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 3 },
        },
      },
    ],
  };
}

export default function AbilityGraph() {
  const [selectedAbility, setSelectedAbility] = useState<AbilityNode | null>(null);

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
        <Text type="secondary">点击任意能力节点查看详细信息，拖拽可交互</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={buildGraphOption()}
          style={{ height: 550 }}
          onEvents={{ click: handleChartClick }}
          notMerge
        />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          <Tag color="green" style={{ fontSize: 12 }}>🟢 已精通 (Lv.4-5)</Tag>
          <Tag color="blue" style={{ fontSize: 12 }}>🔵 进行中 (Lv.2-3)</Tag>
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
