import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    // 模拟登录验证
    setTimeout(() => {
      if (values.username === 'zx' && values.password === '123') {
        message.success('登录成功！');
        onLogin();
      } else {
        message.error('用户名或密码错误！');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#e88fab', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#d4537b', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* 背景圆角方形 */}
              <rect x="4" y="4" width="48" height="48" rx="12" fill="url(#bgGradient)" opacity="0.95"/>

              {/* 左侧DNA链 */}
              <g opacity="0.9">
                <path d="M16 18 Q18 20 16 22 Q14 24 16 26 Q18 28 16 30 Q14 32 16 34"
                      stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M22 18 Q20 20 22 22 Q24 24 22 26 Q20 28 22 30 Q24 32 22 34"
                      stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <line x1="16" y1="20" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.7"/>
                <line x1="16" y1="26" x2="22" y2="26" stroke="white" strokeWidth="2" opacity="0.7"/>
                <line x1="16" y1="32" x2="22" y2="32" stroke="white" strokeWidth="2" opacity="0.7"/>
              </g>

              {/* 分隔线 */}
              <line x1="28" y1="18" x2="28" y2="38" stroke="white" strokeWidth="1.5" opacity="0.3"/>

              {/* 右侧数据图表 */}
              <g opacity="0.9">
                <rect x="32" y="32" width="4" height="6" rx="1" fill="white"/>
                <rect x="38" y="28" width="4" height="10" rx="1" fill="white"/>
                <rect x="44" y="22" width="4" height="16" rx="1" fill="white"/>
                <polyline points="33,30 39,26 45,20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="33" cy="30" r="1.5" fill="white"/>
                <circle cx="39" cy="26" r="1.5" fill="white"/>
                <circle cx="45" cy="20" r="1.5" fill="white"/>
              </g>

              {/* 底部小对勾 */}
              <circle cx="46" cy="44" r="5" fill="white" opacity="0.95"/>
              <path d="M44 44L45.5 45.5L48 43" stroke="#d4537b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Space direction="vertical" size={4} style={{ textAlign: 'center' }}>
            <Title level={2} className="login-title">
              医学期刊智能审查
            </Title>
            <Text className="login-subtitle">
              Medical Paper Intelligent Review
            </Text>
          </Space>
        </div>

        <Form
          name="login"
          className="login-form"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密码"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            测试账号：用户名 zx，密码 123
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;