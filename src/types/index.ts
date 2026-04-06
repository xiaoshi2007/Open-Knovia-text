export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'enterprise';
  avatar?: string;
  email?: string;
  title?: string;
  company?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  courseId: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites?: string[];
}

export interface AbilityNode {
  id: string;
  label: string;
  category: string;
  level: number;
  maxLevel: number;
}

export interface AbilityEdge {
  source: string;
  target: string;
  relation: string;
}

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'fill' | 'essay';
  content: string;
  options?: { key: string; text: string }[];
  answer: string | string[];
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  knowledgeId: string;
}

export interface Course {
  id: string;
  name: string;
  teacherId: string;
  description: string;
  chapters: { id: string; name: string; knowledgeIds: string[] }[];
}

export interface JobPosition {
  id: string;
  title: string;
  companyId: string;
  requirements: { abilityId: string; minLevel: number }[];
  skills: string[];
  salary: string;
  location: string;
  description: string;
}

export interface MatchResult {
  studentId: string;
  jobId: string;
  score: number;
  matchedAbilities: string[];
  missingAbilities: string[];
}

export interface MatchComparison {
  abilityId: string;
  abilityLabel: string;
  required: number;
  actual: number;
  matched: boolean;
}
