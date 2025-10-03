import React, { useState } from 'react';
import { Layout, Steps, Button, message, Spin, Typography } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import FileUpload from './components/FileUpload';
import ReviewReport from './components/ReviewReport';
import { parseDocument } from './services/documentParser';
import { reviewPaper, ReviewResult } from './services/geminiService';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paperContent, setPaperContent] = useState<string>('');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      message.info('正在解析文档...');
      const content = await parseDocument(file);
      setPaperContent(content);
      message.success('文档解析成功！');
      setCurrentStep(1);
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
      message.info('AI正在审核论文，请稍候...');
      const result = await reviewPaper(paperContent);
      setReviewResult(result);
      setCurrentStep(2);
      message.success('审核完成！');
    } catch (error: any) {
      message.error('审核失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setPaperContent('');
    setReviewResult(null);
  };

  const steps = [
    {
      title: '上传论文',
      icon: <FileTextOutlined />,
    },
    {
      title: 'AI审核',
      icon: <SolutionOutlined />,
    },
    {
      title: '查看报告',
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ margin: '12px 0', color: '#1890ff' }}>
          医学期刊论文智能审核系统
        </Title>
      </Header>

      <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 40 }} />

        <Spin spinning={loading} tip="处理中...">
          {currentStep === 0 && <FileUpload onFileUploaded={handleFileUpload} />}

          {currentStep === 1 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Title level={3}>论文已上传成功</Title>
              <p>字数：{paperContent.split(/\s+/).length} 字</p>
              <Button type="primary" size="large" onClick={handleReview}>
                开始AI审核
              </Button>
            </div>
          )}

          {currentStep === 2 && reviewResult && (
            <>
              <ReviewReport
                overallScore={reviewResult.overallScore}
                summary={reviewResult.summary}
                issues={reviewResult.issues}
                recommendations={reviewResult.recommendations}
              />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button onClick={handleReset} size="large">
                  审核新论文
                </Button>
              </div>
            </>
          )}
        </Spin>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        医学期刊论文智能审核系统 ©2025 Powered by Gemini AI
      </Footer>
    </Layout>
  );
}

export default App;
