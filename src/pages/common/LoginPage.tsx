import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { UserOutlined, BankOutlined, RocketOutlined, ReadOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/appStore';

const { Title, Text } = Typography;

const roles = [
  {
    key: 'student',
    icon: <ReadOutlined style={{ fontSize: 56, color: '#6366f1' }} />,
    title: '我是学生',
    desc: '探索能力图谱，智能学习，个性化成长',
    gradient: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    border: '#6366f1',
  },
  {
    key: 'teacher',
    icon: <UserOutlined style={{ fontSize: 56, color: '#8b5cf6' }} />,
    title: '我是教师',
    desc: '知识图谱教学，AI智能组卷，精准学情分析',
    gradient: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    border: '#8b5cf6',
  },
  {
    key: 'enterprise',
    icon: <BankOutlined style={{ fontSize: 56, color: '#a78bfa' }} />,
    title: '我是企业HR',
    desc: '人才图谱探索，人岗智能匹配，精准招聘',
    gradient: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    border: '#a78bfa',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);

  const handleRoleSelect = (role: 'student' | 'teacher' | 'enterprise') => {
    const names: Record<string, string> = { student: '张三', teacher: '赵教授', enterprise: '字节跳动HR' };
    const ids: Record<string, string> = { student: 's001', teacher: 't001', enterprise: 'e001' };
    login({ id: ids[role], name: names[role], role, token: `mock-token-${role}` });
    localStorage.setItem('zhimai_token', `mock-token-${role}`);
    navigate(`/${role}`);
  };

  return (
    <div className="login-bg">
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 900, padding: '0 24px' }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              marginBottom: 16,
            }}
          >
            <RocketOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={1} style={{ color: 'white', marginBottom: 8, letterSpacing: 4 }}>
            知脉
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            以知识图谱与能力图谱为核心 · 连接学生、教师与企业的智能平台
          </Text>
        </div>

        {/* Role Cards */}
        <Row gutter={24} justify="center">
          {roles.map((role) => (
            <Col xs={24} sm={8} key={role.key}>
              <Card
                className="role-card"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                }}
                bordered={false}
                hoverable
                onClick={() => handleRoleSelect(role.key as 'student' | 'teacher' | 'enterprise')}
              >
                <div className="role-icon">{role.icon}</div>
                <div className="role-title">{role.title}</div>
                <div className="role-desc">{role.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
