import React from 'react';
import { Radio, Space, Typography } from 'antd';

const { Title, Text } = Typography;

export type ModelType = 'gemini' | 'qwen' | 'both';

interface ModelSelectorProps {
  value: ModelType;
  onChange: (value: ModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="3" stroke="#d4537b" strokeWidth="1.5" fill="none"/>
            <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="#d4537b" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 11V14M10 16H14" stroke="#d4537b" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="18" cy="6" r="2" fill="#ffe0e6"/>
          </svg>
          <Title level={4} style={{ color: '#2c3e50', fontWeight: 500, marginBottom: 0 }}>
            选择审核模型
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          可选择单个模型或双模型对比分析
        </Text>
      </div>

      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Radio value="qwen" style={{ width: '100%', padding: '10px 12px', border: '1px solid #f0f0f0', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginLeft: 8 }}>
              <Text strong style={{ color: '#2c3e50', whiteSpace: 'nowrap' }}>Qwen Max</Text>
              <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>阿里云通义千问旗舰模型</Text>
            </div>
          </Radio>
          <Radio value="gemini" style={{ width: '100%', padding: '10px 12px', border: '1px solid #f0f0f0', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginLeft: 8 }}>
              <Text strong style={{ color: '#2c3e50', whiteSpace: 'nowrap' }}>Gemini 2.0 Flash</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>Google 最新生成式AI</Text>
                <Text style={{ fontSize: 10, color: '#ff4d4f', whiteSpace: 'nowrap', flexShrink: 0 }}>需要魔法</Text>
              </div>
            </div>
          </Radio>
          <Radio value="both" style={{ width: '100%', padding: '10px 12px', border: '1px solid #f0f0f0', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginLeft: 8 }}>
              <Text strong style={{ color: '#2c3e50', whiteSpace: 'nowrap' }}>双模型对比</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>同时使用两个模型并对比结果</Text>
                <Text style={{ fontSize: 10, color: '#ff4d4f', whiteSpace: 'nowrap', flexShrink: 0 }}>需要魔法</Text>
              </div>
            </div>
          </Radio>
        </Space>
      </Radio.Group>
    </Space>
  );
};

export default ModelSelector;
