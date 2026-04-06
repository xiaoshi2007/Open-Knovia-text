import { useState } from 'react';
import { Card, Typography, Tag, Select, Drawer, Button } from 'antd';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { mockKnowledgeNodes, mockCourses } from '../../data/mockData';
import type { KnowledgeNode } from '../../types';

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

const { Title, Text, Paragraph } = Typography;

const nodeColors: Record<number, string> = {
  1: '#10b981',
  2: '#6366f1',
  3: '#f59e0b',
  4: '#ef4444',
  5: '#dc2626',
};

function buildKnowledgeGraph(courseId: string) {
  const nodes = mockKnowledgeNodes.filter(n => n.courseId === courseId);
  const edges = nodes.flatMap(n =>
    (n.prerequisites || []).map(pre => ({
      source: pre,
      target: n.id,
      lineStyle: { color: '#a5b4fc', width: 2, type: 'dashed' as const },
      label: { show: true, formatter: '先修', fontSize: 10, color: '#9ca3af' },
    }))
  );

  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `<strong>${params.data.name}</strong><br/>难度: ${'★'.repeat(params.data.difficulty)}${'☆'.repeat(5 - params.data.difficulty)}`;
        }
        return '';
      },
    },
    animationDuration: 1500,
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes.map(n => ({
          id: n.id,
          name: n.label,
          symbolSize: Math.max(35, n.difficulty * 12 + 20),
          itemStyle: { color: nodeColors[n.difficulty] || '#6366f1', borderColor: '#fff', borderWidth: 2 },
          label: { show: true, fontSize: 12, fontWeight: 500, color: '#1f2937' },
          value: n.difficulty,
        })),
        links: edges,
        roam: true,
        draggable: true,
        force: {
          repulsion: 300,
          gravity: 0.15,
          edgeLength: [100, 200],
        },
        emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
      },
    ],
  };
}

export default function KnowledgeGraphView() {
  const [courseId, setCourseId] = useState('c001');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  const handleChartClick = (params: any) => {
    if (params.dataType === 'node') {
      const node = mockKnowledgeNodes.find(n => n.id === params.data.id);
      setSelectedNode(node || null);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>🌐 知识图谱视图</Title>
          <Text type="secondary">可视化课程知识点关系，支持缩放和拖拽交互</Text>
        </div>
        <Select
          value={courseId}
          onChange={setCourseId}
          style={{ width: 200 }}
          options={mockCourses.map(c => ({ value: c.id, label: c.name }))}
        />
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={buildKnowledgeGraph(courseId)}
          style={{ height: 500 }}
          onEvents={{ click: handleChartClick }}
          notMerge
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
          {Object.entries(nodeColors).map(([d, c]) => (
            <Tag key={d} color={c}>
              {'★'.repeat(Number(d))} {['', '入门', '基础', '中等', '较难', '困难'][Number(d)]}
            </Tag>
          ))}
        </div>
      </Card>

      <Drawer
        title={selectedNode?.label}
        placement="right"
        width={400}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      >
        {selectedNode && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>难度：</Text>
              <Tag color={nodeColors[selectedNode.difficulty]}>
                {'★'.repeat(selectedNode.difficulty)}{'☆'.repeat(5 - selectedNode.difficulty)}
              </Tag>
            </div>
            <Title level={5}>描述</Title>
            <Paragraph>{selectedNode.description}</Paragraph>
            {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
              <>
                <Title level={5}>前置知识</Title>
                {selectedNode.prerequisites.map(preId => {
                  const pre = mockKnowledgeNodes.find(n => n.id === preId);
                  return pre ? <Tag key={preId} color="blue" style={{ marginBottom: 4 }}>{pre.label}</Tag> : null;
                })}
              </>
            )}
            <div style={{ marginTop: 24 }}>
              <Button type="primary" block>编辑知识点</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
