import React, { useState } from 'react';
import { Layout, Row, Col, Button, message, Spin, Typography, Divider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import FileUpload from './components/FileUpload';
import ModelSelector, { ModelType } from './components/ModelSelector';
import ReviewReport from './components/ReviewReport';
import { parseDocument } from './services/documentParser';
import { reviewPaper as reviewWithGemini, ReviewResult } from './services/geminiService';
import { reviewPaper as reviewWithQwen } from './services/qwenService';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export interface ComparisonResult {
  gemini?: ReviewResult;
  qwen?: ReviewResult;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [paperContent, setPaperContent] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      message.info('正在解析文档...');
      const content = await parseDocument(file);
      setPaperContent(content);
      message.success('文档解析成功！');
    } catch (error: any) {
      message.error(error.message || '文档解析失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!paperContent) {
      message.error('请先上传论文');
      return;
    }

    setLoading(true);
    try {
      if (selectedModel === 'both') {
        message.info('正在使用双模型进行审核，请稍候...');
        const [geminiResult, qwenResult] = await Promise.all([
          reviewWithGemini(paperContent),
          reviewWithQwen(paperContent)
        ]);
        setComparisonResult({
          gemini: geminiResult,
          qwen: qwenResult
        });
        setReviewResult(null);
      } else if (selectedModel === 'gemini') {
        message.info('Gemini AI正在审核论文，请稍候...');
        const result = await reviewWithGemini(paperContent);
        setReviewResult(result);
        setComparisonResult(null);
      } else {
        message.info('Qwen Max正在审核论文，请稍候...');
        const result = await reviewWithQwen(paperContent);
        setReviewResult(result);
        setComparisonResult(null);
      }
      message.success('审核完成！');
    } catch (error: any) {
      message.error('审核失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPaperContent('');
    setReviewResult(null);
    setComparisonResult(null);
    setSelectedModel('gemini');
  };

  const hasResult = reviewResult || comparisonResult;

  return (
    <Layout className="medical-layout">
      <Header className="medical-header">
        <div className="header-content">
          <svg className="header-logo" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="header-text">
            <Title level={2} className="header-title">
              医学期刊论文智能审核系统
            </Title>
            <Text className="header-subtitle">Medical Paper Intelligent Review System</Text>
          </div>
        </div>
      </Header>

      <Content className="medical-content">
        <div className="content-wrapper">
          <Spin spinning={loading} tip="处理中..." indicator={<div className="custom-spinner" />}>
            <Row gutter={[24, 24]}>
              {/* 左侧上传和配置区域 */}
              {!leftPanelCollapsed && (
                <Col xs={24} lg={hasResult ? 8 : 24} className="left-panel-container">
                  <div className="left-panel">
                    {hasResult && (
                      <Button
                        className="collapse-button"
                        icon={<MenuFoldOutlined />}
                        onClick={() => setLeftPanelCollapsed(true)}
                        size="small"
                      >
                        收起
                      </Button>
                    )}
                    <FileUpload onFileUploaded={handleFileUpload} wordCount={paperContent ? paperContent.split(/\s+/).length : 0} />

                    {paperContent && (
                      <>
                        <Divider className="medical-divider" />
                        <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                      </>
                    )}

                    {paperContent && (
                      <div className="action-buttons">
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleReview}
                          block
                          className="review-button"
                        >
                          开始审核
                        </Button>
                        {hasResult && (
                          <Button
                            size="large"
                            onClick={handleReset}
                            block
                            className="reset-button"
                          >
                            重新审核
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              )}

              {/* 展开按钮 */}
              {leftPanelCollapsed && hasResult && (
                <div className="expand-button-wrapper">
                  <Button
                    className="expand-button"
                    icon={<MenuUnfoldOutlined />}
                    onClick={() => setLeftPanelCollapsed(false)}
                  >
                  </Button>
                </div>
              )}

              {/* 右侧结果展示区域 */}
              {hasResult && (
                <Col xs={24} lg={leftPanelCollapsed ? 24 : 16} className="result-panel-container">
                  <div className="result-panel">
                    <ReviewReport
                      reviewResult={reviewResult}
                      comparisonResult={comparisonResult}
                    />
                  </div>
                </Col>
              )}
            </Row>
          </Spin>
        </div>
      </Content>

      <Footer className="medical-footer">
        <div className="footer-content">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L2 6V10C2 14.5 5.5 18.5 10 19C14.5 18.5 18 14.5 18 10V6L10 2Z" stroke="#d4537b" strokeWidth="1.5" fill="none"/>
            <path d="M7 10L9 12L13 8" stroke="#d4537b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text className="footer-text">
            医学期刊论文智能审核系统 ©2025 · Powered by Advanced AI Models
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
