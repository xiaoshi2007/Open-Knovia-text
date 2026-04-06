import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message, Typography, Space, Divider } from 'antd';
import {
  MobileOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  UserOutlined,
  BankOutlined,
  ReadOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useAppStore } from '../../store/appStore';
import './SmsLoginPage.css';

const { Title, Text } = Typography;

/* ========== 滑块验证码组件 ========== */
function SliderCaptcha({ onSuccess }: { onSuccess: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const maxLeftRef = useRef(0);
  const verifiedRef = useRef(false);

  const handleStart = useCallback((clientX: number) => {
    if (verifiedRef.current) return;
    setIsDragging(true);
    startXRef.current = clientX - sliderLeft;
  }, [sliderLeft]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    const maxLeft = container.offsetWidth - 44;
    maxLeftRef.current = maxLeft;
    let newLeft = clientX - startXRef.current;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    setSliderLeft(newLeft);
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (maxLeftRef.current > 0 && sliderLeft >= maxLeftRef.current * 0.85) {
      verifiedRef.current = true;
      setSliderLeft(maxLeftRef.current);
      onSuccess();
    } else {
      setTimeout(() => setSliderLeft(0), 300);
    }
  }, [isDragging, sliderLeft, onSuccess]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMove, handleEnd]);

  return (
    <div className="captcha-container" ref={containerRef}>
      <div className="captcha-track">
        <div
          className={`captcha-fill ${verifiedRef.current ? 'verified' : ''}`}
          style={{ width: `${sliderLeft + 44}px` }}
        />
        <Text className="captcha-hint" style={{ opacity: verifiedRef.current ? 0 : 1 }}>
          {isDragging ? '松开完成验证' : '请拖动滑块完成验证'}
        </Text>
        {verifiedRef.current && (
          <CheckCircleFilled className="captcha-check" style={{ opacity: 1 }} />
        )}
      </div>
      <div
        className={`captcha-slider ${verifiedRef.current ? 'verified' : ''}`}
        style={{ left: sliderLeft }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        {verifiedRef.current ? (
          <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
        ) : (
          <span className="captcha-arrows">→→</span>
        )}
      </div>
    </div>
  );
}

/* ========== 角色卡片数据 ========== */
const roles = [
  {
    key: 'student' as const,
    icon: <ReadOutlined style={{ fontSize: 56, color: '#6366f1' }} />,
    title: '我是学生',
    desc: '探索能力图谱，智能学习，个性化成长',
    gradient: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    border: '#6366f1',
    particles: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  },
  {
    key: 'teacher' as const,
    icon: <UserOutlined style={{ fontSize: 56, color: '#8b5cf6' }} />,
    title: '我是教师',
    desc: '知识图谱教学，AI智能组卷，精准学情分析',
    gradient: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    border: '#8b5cf6',
    particles: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
  },
  {
    key: 'enterprise' as const,
    icon: <BankOutlined style={{ fontSize: 56, color: '#a78bfa' }} />,
    title: '我是企业HR',
    desc: '人才图谱探索，人岗智能匹配，精准招聘',
    gradient: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    border: '#a78bfa',
    particles: ['#a78bfa', '#c084fc', '#d8b4fe', '#e9d5ff'],
  },
];

/* ========== 角色卡片组件（带动态效果） ========== */
function RoleCard({
  role,
  index,
  onClick,
}: {
  role: typeof roles[number];
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; color: string; delay: number }[]
  >([]);

  // 卡片出场动画延迟
  const cardStyle: React.CSSProperties = {
    animation: `roleCardSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s both`,
  };

  const handleMouseEnter = () => {
    setHovered(true);
    // 生成浮动粒子
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      color: role.particles[Math.floor(Math.random() * role.particles.length)],
      delay: i * 0.1,
    }));
    setParticles(newParticles);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className={`role-card-animated ${hovered ? 'hovered' : ''}`}
      style={{ ...cardStyle, '--card-border': role.border } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 浮动粒子 */}
      {hovered && (
        <div className="role-card-particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="role-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 背景光效 */}
      <div className="role-card-glow" style={{ background: role.gradient }} />

      {/* 脉冲环 */}
      <div className="role-card-pulse" style={{ borderColor: role.border }} />

      {/* 内容 */}
      <div className="role-card-inner">
        <div
          className="role-card-icon-wrapper"
          style={{ '--icon-color': role.border } as React.CSSProperties}
        >
          <div className="role-card-icon-float">{role.icon}</div>
        </div>
        <div className="role-card-title">{role.title}</div>
        <div className="role-card-desc">{role.desc}</div>
        <div className="role-card-arrow">
          <span>→</span>
        </div>
      </div>

      {/* 底部渐变条 */}
      <div
        className="role-card-bottom-bar"
        style={{
          background: `linear-gradient(90deg, transparent, ${role.border}, transparent)`,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </div>
  );
}

/* ========== 主登录页 ========== */
export default function SmsLoginPage() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);

  const [step, setStep] = useState<'phone' | 'role' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'enterprise' | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const phoneReg = /^1[3-9]\d{9}$/;

  // 通过人机验证后 → 进入角色选择
  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true);
    setTimeout(() => setStep('role'), 600);
  };

  // 选择角色 → 发送验证码
  const handleRoleSelect = (role: 'student' | 'teacher' | 'enterprise') => {
    setSelectedRole(role);
    setCountdown(60);
    message.success('验证码已发送');
    setTimeout(() => setStep('code'), 300);
  };

  // 验证码登录
  const handleVerifyCode = () => {
    if (!selectedRole) return;
    if (code.length < 4) {
      message.warning('请输入验证码');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const names: Record<string, string> = { student: '张三', teacher: '赵教授', enterprise: '字节跳动HR' };
      const ids: Record<string, string> = { student: 's001', teacher: 't001', enterprise: 'e001' };
      login({
        id: ids[selectedRole],
        name: names[selectedRole],
        role: selectedRole,
        phone,
        token: `mock-token-${selectedRole}-${Date.now()}`,
      });
      localStorage.setItem('zhimai_token', `mock-token-${selectedRole}-${Date.now()}`);
      navigate(`/${selectedRole}`);
    }, 1200);
  };

  const currentRoleInfo = roles.find((r) => r.key === selectedRole);
  const roleLabel: Record<string, string> = { student: '学生', teacher: '教师', enterprise: '企业HR' };

  // Step 3: 验证码输入
  if (step === 'code' && selectedRole) {
    return (
      <div className="login-bg">
        <div className="sms-login-container sms-login-container-sm">
          <div className="sms-login-header">
            <div className="sms-login-logo" style={{ background: `linear-gradient(135deg, ${currentRoleInfo!.border}, #6366f1)` }}>
              <RocketOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
            <Title level={3} style={{ margin: '12px 0 4px', color: '#1e1b4b' }}>
              {currentRoleInfo!.title} · 登录
            </Title>
            <Text type="secondary">
              验证码已发送至 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </Text>
          </div>
          <div className="sms-login-form">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input
                size="large"
                prefix={<SafetyCertificateOutlined style={{ color: '#6366f1' }} />}
                placeholder="请输入6位验证码"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ letterSpacing: 8, fontSize: 20, textAlign: 'center' }}
              />
              <Button
                size="large"
                block
                loading={loading}
                onClick={handleVerifyCode}
                style={{ height: 48, borderRadius: 10, fontWeight: 600, fontSize: 16 }}
                type="primary"
              >
                验证登录
              </Button>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="link" size="small" onClick={() => { setStep('role'); setSelectedRole(null); }}>
                  返回选择身份
                </Button>
                <Button
                  type="link"
                  size="small"
                  disabled={countdown > 0}
                  onClick={() => { setCountdown(60); message.success('验证码已重新发送'); }}
                >
                  {countdown > 0 ? `重新发送 (${countdown}s)` : '重新发送'}
                </Button>
              </div>
            </Space>
            <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                💡 演示模式：输入任意4-6位数字即可通过验证
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: 角色选择（竖版大卡片 + 动态效果）
  if (step === 'role') {
    return (
      <div className="login-bg">
        <div className="role-select-fullscreen">
          {/* 顶部信息 */}
          <div className="role-select-top" style={{ animation: 'roleCardSlideUp 0.5s ease both' }}>
            <div className="sms-login-logo">
              <RocketOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
            <Title level={2} style={{ margin: '12px 0 4px', color: 'white', letterSpacing: 2 }}>
              知脉
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              选择你的身份，开始探索智能知识能力平台
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'block', marginTop: 8 }}>
              📱 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} · 人机验证已通过
            </Text>
          </div>

          {/* 三个角色卡片 */}
          <div className="role-select-cards">
            {roles.map((role, idx) => (
              <RoleCard
                key={role.key}
                role={role}
                index={idx}
                onClick={() => handleRoleSelect(role.key)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: 手机号 + 滑块验证
  return (
    <div className="login-bg">
      <div className="sms-login-container">
        <div className="sms-login-header">
          <div className="sms-login-logo">
            <RocketOutlined style={{ fontSize: 24, color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: '12px 0 4px', color: '#1e1b4b', letterSpacing: 2 }}>
            知脉
          </Title>
          <Text type="secondary">智能知识能力平台</Text>
        </div>

        <div className="sms-login-form">
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ color: '#1e1b4b' }}>手机号登录</Text>
          </div>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Input
              size="large"
              prefix={<MobileOutlined style={{ color: '#6366f1' }} />}
              placeholder="请输入手机号"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              status={phone && !phoneReg.test(phone) ? 'error' : undefined}
            />
            {phone && !phoneReg.test(phone) && (
              <Text type="danger" style={{ fontSize: 12, marginTop: -8 }}>
                手机号格式不正确
              </Text>
            )}
            <SliderCaptcha onSuccess={handleCaptchaSuccess} />
          </Space>
          <Divider plain>
            <Text type="secondary" style={{ fontSize: 12 }}>
              未注册手机号将自动创建账号
            </Text>
          </Divider>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              提示：输入手机号 → 拖动滑块 → 选择身份 → 输入验证码
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
