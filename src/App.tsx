import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import SmsLoginPage from './pages/common/SmsLoginPage';
import Layout from './components/Layout';
import SmartQA from './pages/common/SmartQA';
import StudentPortal from './pages/student/StudentPortal';
import AbilityGraph from './pages/student/AbilityGraph';
import SmartPractice from './pages/student/SmartPractice';
import PracticeResult from './pages/student/PracticeResult';
import TeacherPortal from './pages/teacher/TeacherPortal';
import KnowledgeGraphView from './pages/teacher/KnowledgeGraphView';
import AITestPaper from './pages/teacher/AITestPaper';
import EnterprisePortal from './pages/enterprise/EnterprisePortal';
import TalentExplorer from './pages/enterprise/TalentExplorer';
import JobMatchAnalysis from './pages/enterprise/JobMatchAnalysis';
import AbilityResumeGenerator from './pages/enterprise/AbilityResumeGenerator';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const user = useAppStore((s) => s.user);
  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AnyAuthRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  if (!user.role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const user = useAppStore((s) => s.user);

  return (
    <Routes>
      <Route path="/login" element={user.role ? <Navigate to="/" replace /> : <SmsLoginPage />} />
      <Route element={<Layout />}>
        {/* 智能问答 — 所有角色共享 */}
        <Route path="qa" element={<AnyAuthRoute><SmartQA /></AnyAuthRoute>} />
        {/* Student routes */}
        <Route path="student" element={<ProtectedRoute role="student"><StudentPortal /></ProtectedRoute>} />
        <Route path="student/ability-graph" element={<ProtectedRoute role="student"><AbilityGraph /></ProtectedRoute>} />
        <Route path="student/practice" element={<ProtectedRoute role="student"><SmartPractice /></ProtectedRoute>} />
        <Route path="student/practice/result" element={<ProtectedRoute role="student"><PracticeResult /></ProtectedRoute>} />
        {/* Teacher routes */}
        <Route path="teacher" element={<ProtectedRoute role="teacher"><TeacherPortal /></ProtectedRoute>} />
        <Route path="teacher/knowledge-graph" element={<ProtectedRoute role="teacher"><KnowledgeGraphView /></ProtectedRoute>} />
        <Route path="teacher/ai-testpaper" element={<ProtectedRoute role="teacher"><AITestPaper /></ProtectedRoute>} />
        {/* Enterprise routes */}
        <Route path="enterprise" element={<ProtectedRoute role="enterprise"><EnterprisePortal /></ProtectedRoute>} />
        <Route path="enterprise/talent-explorer" element={<ProtectedRoute role="enterprise"><TalentExplorer /></ProtectedRoute>} />
        <Route path="enterprise/job-match" element={<ProtectedRoute role="enterprise"><JobMatchAnalysis /></ProtectedRoute>} />
        <Route path="enterprise/ability-resume" element={<ProtectedRoute role="enterprise"><AbilityResumeGenerator /></ProtectedRoute>} />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user.role ? `/${user.role}` : '/login'} replace />} />
      </Route>
    </Routes>
  );
}
