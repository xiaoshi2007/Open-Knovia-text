import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Avatar, Dropdown, Badge, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  BookOutlined,
  AimOutlined,
  FileTextOutlined,
  TeamOutlined,
  ApartmentOutlined,
  RobotOutlined,
  SolutionOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store/appStore';

const { Header, Sider, Content } = AntLayout;

// Menu config by role
// Common menu item for all roles
const qaMenuItem = { key: 'qa', icon: <CommentOutlined />, label: '智能问答', path: '/qa' };

const menuConfig: Record<string, { key: string; icon: React.ReactNode; label: string; path: string }[]> = {
  student: [
    { key: 'home', icon: <HomeOutlined />, label: '学生门户', path: '/student' },
    { key: 'ability', icon: <AimOutlined />, label: '能力图谱', path: '/student/ability-graph' },
    { key: 'practice', icon: <FileTextOutlined />, label: '智能练习', path: '/student/practice' },
    { key: 'courses', icon: <BookOutlined />, label: '我的课程', path: '/student' },
    qaMenuItem,
  ],
  teacher: [
    { key: 'home', icon: <HomeOutlined />, label: '教师门户', path: '/teacher' },
    { key: 'knowledge', icon: <ApartmentOutlined />, label: '知识图谱', path: '/teacher/knowledge-graph' },
    { key: 'aipaper', icon: <RobotOutlined />, label: '智能组卷', path: '/teacher/ai-testpaper' },
    { key: 'classes', icon: <TeamOutlined />, label: '班级管理', path: '/teacher' },
    qaMenuItem,
  ],
  enterprise: [
    { key: 'home', icon: <HomeOutlined />, label: '企业门户', path: '/enterprise' },
    { key: 'talent', icon: <SearchOutlined />, label: '人才图谱', path: '/enterprise/talent-explorer' },
    { key: 'match', icon: <ThunderboltOutlined />, label: '人岗匹配', path: '/enterprise/job-match' },
    { key: 'jobs', icon: <SolutionOutlined />, label: '岗位管理', path: '/enterprise' },
    qaMenuItem,
  ],
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('zhimai_token');
    navigate('/login');
  };

  const items = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'logout') handleLogout();
  };

  const menuItems = (menuConfig[user.role || ''] || []).map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path),
  }));

  const roleLabel: Record<string, string> = {
    student: '学生',
    teacher: '教师',
    enterprise: '企业HR',
  };

  // Find the currently active menu key based on pathname
  const currentPath = location.pathname;
  const activeKey = (menuConfig[user.role || ''] || []).find((m) => currentPath.startsWith(m.path))?.key || 'home';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}
          >
            知
          </div>
          {!collapsed && (
            <span
              style={{
                marginLeft: 12,
                fontSize: 18,
                fontWeight: 700,
                color: 'white',
                letterSpacing: 2,
              }}
            >
              知脉
            </span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 8,
          }}
        />
      </Sider>

      <AntLayout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18, cursor: 'pointer', color: '#6366f1' }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <span style={{ fontSize: 14, color: '#6b7280' }}>
              {roleLabel[user.role || ''] || ''} · {user.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#6b7280', cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items, onClick: handleDropdownClick }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  icon={<UserOutlined />}
                />
                <span style={{ color: '#374151', fontWeight: 500 }}>{user.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
