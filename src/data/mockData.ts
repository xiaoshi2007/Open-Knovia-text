import type { AbilityNode, Question, Course, KnowledgeNode, JobPosition } from '../types';

export const mockStudentAbilities: AbilityNode[] = [
  { id: 'a1', label: 'Python编程', category: '编程语言', level: 4, maxLevel: 5 },
  { id: 'a2', label: 'Java编程', category: '编程语言', level: 3, maxLevel: 5 },
  { id: 'a3', label: '数据结构', category: '计算机基础', level: 5, maxLevel: 5 },
  { id: 'a4', label: '算法设计', category: '计算机基础', level: 4, maxLevel: 5 },
  { id: 'a5', label: '数据库', category: '计算机基础', level: 3, maxLevel: 5 },
  { id: 'a6', label: '机器学习', category: 'AI/数据', level: 3, maxLevel: 5 },
  { id: 'a7', label: '深度学习', category: 'AI/数据', level: 2, maxLevel: 5 },
  { id: 'a8', label: '沟通能力', category: '软技能', level: 4, maxLevel: 5 },
  { id: 'a9', label: '团队协作', category: '软技能', level: 5, maxLevel: 5 },
  { id: 'a10', label: '项目管理', category: '软技能', level: 2, maxLevel: 5 },
  { id: 'a11', label: '前端开发', category: '工程技能', level: 3, maxLevel: 5 },
  { id: 'a12', label: '后端开发', category: '工程技能', level: 4, maxLevel: 5 },
  { id: 'a13', label: 'Linux', category: '工程技能', level: 3, maxLevel: 5 },
  { id: 'a14', label: 'Git版本控制', category: '工程技能', level: 4, maxLevel: 5 },
  { id: 'a15', label: '英语读写', category: '语言', level: 4, maxLevel: 5 },
];

export const mockAbilityDetails: Record<string, { description: string; resources: { title: string; type: string; url: string }[] }> = {
  a1: { description: '掌握Python基础语法、面向对象编程、标准库使用及常用第三方框架', resources: [{ title: 'Python官方教程', type: '文档', url: '#' }, { title: 'Flask入门指南', type: '教程', url: '#' }] },
  a3: { description: '深入理解数组、链表、栈、队列、树、图等常用数据结构的原理与实现', resources: [{ title: '数据结构可视化', type: '工具', url: '#' }, { title: 'LeetCode题单', type: '练习', url: '#' }] },
  a4: { description: '能够设计高效的算法，掌握分治、动态规划、贪心等核心算法思想', resources: [{ title: '算法导论', type: '书籍', url: '#' }, { title: '竞赛算法入门', type: '教程', url: '#' }] },
  a6: { description: '理解监督学习、无监督学习的基本原理，能够使用scikit-learn实现常见模型', resources: [{ title: '机器学习(周志华)', type: '书籍', url: '#' }, { title: 'Kaggle竞赛', type: '实践', url: '#' }] },
  a11: { description: '熟练使用React/Vue等前端框架，掌握CSS布局和前端性能优化', resources: [{ title: 'React官方文档', type: '文档', url: '#' }, { title: 'CSS Tricks', type: '博客', url: '#' }] },
  a12: { description: '能够使用Node.js/Go/Java等语言开发RESTful API，了解微服务架构', resources: [{ title: 'Node.js实战', type: '书籍', url: '#' }, { title: '微服务设计模式', type: '教程', url: '#' }] },
};

export const mockQuestions: Question[] = [
  { id: 'q1', type: 'single', content: '以下哪种数据结构最适合实现函数调用栈？', options: [{ key: 'A', text: '队列' }, { key: 'B', text: '栈' }, { key: 'C', text: '链表' }, { key: 'D', text: '哈希表' }], answer: 'B', explanation: '栈的后进先出(LIFO)特性完美匹配函数调用的嵌套与返回。', difficulty: 2, tags: ['数据结构', '栈'], knowledgeId: 'k3' },
  { id: 'q2', type: 'single', content: '快速排序的平均时间复杂度是？', options: [{ key: 'A', text: 'O(n)' }, { key: 'B', text: 'O(n log n)' }, { key: 'C', text: 'O(n²)' }, { key: 'D', text: 'O(log n)' }], answer: 'B', explanation: '快排通过分治策略，每次划分将问题规模减半，平均时间复杂度为O(n log n)。', difficulty: 3, tags: ['算法', '排序'], knowledgeId: 'k8' },
  { id: 'q3', type: 'single', content: '在二叉搜索树中查找一个元素的平均时间复杂度是？', options: [{ key: 'A', text: 'O(1)' }, { key: 'B', text: 'O(log n)' }, { key: 'C', text: 'O(n)' }, { key: 'D', text: 'O(n log n)' }], answer: 'B', explanation: '平衡的BST每次比较排除一半节点，因此平均为O(log n)。', difficulty: 3, tags: ['数据结构', '二叉树'], knowledgeId: 'k4' },
  { id: 'q4', type: 'multiple', content: '以下哪些是线性结构？（多选）', options: [{ key: 'A', text: '数组' }, { key: 'B', text: '二叉树' }, { key: 'C', text: '链表' }, { key: 'D', text: '栈' }], answer: ['A', 'C', 'D'], explanation: '数组、链表、栈和队列都是线性结构，二叉树是非线性结构。', difficulty: 1, tags: ['数据结构'], knowledgeId: 'k1' },
  { id: 'q5', type: 'single', content: 'Dijkstra算法不能处理以下哪种情况？', options: [{ key: 'A', text: '有向图' }, { key: 'B', text: '无向图' }, { key: 'C', text: '负权边' }, { key: 'D', text: '稀疏图' }], answer: 'C', explanation: 'Dijkstra基于贪心策略，不能处理负权边，应使用Bellman-Ford算法。', difficulty: 4, tags: ['算法', '图论'], knowledgeId: 'k7' },
];

export const mockCourses: Course[] = [
  { id: 'c001', name: '数据结构与算法', teacherId: 't001', description: '计算机科学核心课程', chapters: [{ id: 'ch1', name: '线性结构', knowledgeIds: ['k1', 'k2', 'k3'] }, { id: 'ch2', name: '树形结构', knowledgeIds: ['k4', 'k5'] }, { id: 'ch3', name: '图论基础', knowledgeIds: ['k6', 'k7'] }] },
  { id: 'c002', name: '机器学习导论', teacherId: 't002', description: '机器学习基础理论', chapters: [{ id: 'ch5', name: '监督学习', knowledgeIds: ['k10', 'k11'] }, { id: 'ch6', name: '无监督学习', knowledgeIds: ['k12', 'k13'] }] },
];

export const mockKnowledgeNodes: KnowledgeNode[] = [
  { id: 'k1', label: '数组', courseId: 'c001', description: '连续内存空间的线性结构', difficulty: 1 },
  { id: 'k2', label: '链表', courseId: 'c001', description: '通过指针连接的线性结构', difficulty: 2, prerequisites: ['k1'] },
  { id: 'k3', label: '栈与队列', courseId: 'c001', description: '受限的线性表', difficulty: 2, prerequisites: ['k1'] },
  { id: 'k4', label: '二叉树', courseId: 'c001', description: '每个节点最多两个子节点的树', difficulty: 3, prerequisites: ['k2', 'k3'] },
  { id: 'k5', label: 'AVL树', courseId: 'c001', description: '自平衡二叉搜索树', difficulty: 4, prerequisites: ['k4'] },
  { id: 'k6', label: '图的基本概念', courseId: 'c001', description: '顶点与边的集合', difficulty: 3, prerequisites: ['k4'] },
  { id: 'k7', label: '最短路径算法', courseId: 'c001', description: 'Dijkstra与Floyd算法', difficulty: 4, prerequisites: ['k6'] },
  { id: 'k8', label: '排序算法', courseId: 'c001', description: '冒泡、快排、归并等排序方法', difficulty: 3, prerequisites: ['k1'] },
  { id: 'k10', label: '线性回归', courseId: 'c002', description: '最基础的监督学习模型', difficulty: 2 },
  { id: 'k11', label: '决策树', courseId: 'c002', description: '基于特征划分的树形分类器', difficulty: 3, prerequisites: ['k10'] },
];

export const mockJobs: JobPosition[] = [
  { id: 'j1', title: '前端开发工程师', companyId: 'e001', requirements: [{ abilityId: 'a11', minLevel: 3 }, { abilityId: 'a1', minLevel: 3 }, { abilityId: 'a14', minLevel: 2 }], skills: ['React', 'TypeScript', 'CSS'], salary: '20K-35K', location: '北京', description: '负责公司核心产品的前端开发与优化' },
  { id: 'j2', title: '后端开发工程师', companyId: 'e001', requirements: [{ abilityId: 'a12', minLevel: 3 }, { abilityId: 'a2', minLevel: 3 }, { abilityId: 'a5', minLevel: 3 }], skills: ['Go', 'Python', 'MySQL'], salary: '25K-40K', location: '北京', description: '设计并实现高可用的后端服务' },
  { id: 'j3', title: '算法工程师', companyId: 'e002', requirements: [{ abilityId: 'a6', minLevel: 4 }, { abilityId: 'a4', minLevel: 4 }, { abilityId: 'a7', minLevel: 2 }], skills: ['PyTorch', 'Python'], salary: '30K-50K', location: '深圳', description: '负责推荐系统和NLP算法研发' },
];

// Talent pool data (students for enterprise view)
export const mockTalentPool = [
  { id: 's001', name: '张三', major: '计算机科学', skills: ['Python', 'React', '算法'], matchScore: 85 },
  { id: 's002', name: '李四', major: '软件工程', skills: ['React', 'TypeScript', 'Vue'], matchScore: 91 },
  { id: 's003', name: '王五', major: '数据科学', skills: ['Java', 'Go', 'MySQL'], matchScore: 78 },
  { id: 's004', name: '赵六', major: '人工智能', skills: ['PyTorch', 'TensorFlow', 'Python'], matchScore: 88 },
  { id: 's005', name: '孙七', major: '计算机科学', skills: ['C++', 'Linux', 'Docker'], matchScore: 72 },
  { id: 's006', name: '周八', major: '软件工程', skills: ['React', 'Node.js', 'MongoDB'], matchScore: 82 },
  { id: 's007', name: '吴九', major: '信息安全', skills: ['Python', '渗透测试', 'Linux'], matchScore: 76 },
  { id: 's008', name: '郑十', major: '计算机科学', skills: ['Go', 'Kubernetes', '微服务'], matchScore: 90 },
];
