import api from './api';

// TODO: 未来接入真实AI服务 — 以下所有接口目前已预留，返回模拟数据

// 认证
export const authAPI = {
  login: (role: string) => api.post('/auth/login', { role }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// 知识图谱 & 能力图谱
export const graphAPI = {
  getKnowledgeGraph: (courseId: string) => api.get(`/graph/knowledge/${courseId}`),
  getAbilityGraph: (userId: string) => api.get(`/graph/ability/${userId}`),
  getTalentPool: () => api.get('/graph/talent-pool'),
};

// AI 服务
export const aiAPI = {
  generateQuestions: (params: { courseId: string; chapterId?: string; difficulty?: number; count?: number }) =>
    api.post('/ai/generate-questions', params),
  analyzeResult: (params: { answers: Record<string, unknown>; paperId?: string }) =>
    api.post('/ai/analyze-result', params),
  recommendPath: (params: { userId: string; targetAbilityId: string }) =>
    api.post('/ai/recommend-path', params),
};

// 匹配
export const matchAPI = {
  rank: (jobId?: string) => api.post('/match/rank', { jobId }),
  compare: (studentId: string, jobId: string) => api.post('/match/compare', { studentId, jobId }),
  getJobs: () => api.get('/match/jobs'),
  getStudents: () => api.get('/match/students'),
  saveManualReview: async (payload: {
    studentId: string;
    jobId: string;
    aiScore: number;
    manualScore: number;
    finalScore: number;
    comment?: string;
  }) => {
    const storageKey = `manual_review_${payload.jobId}_${payload.studentId}`;
    const record = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    try {
      // 优先尝试真实接口；若后端尚未接入则走本地兜底
      await api.post('/match/manual-review', record);
      localStorage.setItem(storageKey, JSON.stringify(record));
      return { success: true, source: 'api', data: record };
    } catch (_err) {
      localStorage.setItem(storageKey, JSON.stringify(record));
      return { success: true, source: 'local', data: record };
    }
  },
  getManualReview: async (studentId: string, jobId: string) => {
    const storageKey = `manual_review_${jobId}_${studentId}`;
    try {
      const res = await api.get(`/match/manual-review/${jobId}/${studentId}`);
      if (res) return res;
    } catch (_err) {
      // ignore and fallback localStorage
    }
    const local = localStorage.getItem(storageKey);
    return local ? JSON.parse(local) : null;
  },
};

// 课程
export const courseAPI = {
  list: () => api.get('/course/list'),
  detail: (id: string) => api.get(`/course/${id}`),
  classes: (id: string) => api.get(`/course/${id}/classes`),
};

// 招聘
export const recruitmentAPI = {
  getJobs: (companyId?: string) => api.get('/recruitment/jobs', { params: { companyId } }),
  getApplicants: (jobId: string) => api.get(`/recruitment/applicants/${jobId}`),
  createJob: (data: unknown) => api.post('/recruitment/jobs', data),
};
