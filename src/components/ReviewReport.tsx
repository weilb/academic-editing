import React from 'react';
import { Card, Tag, Typography, Collapse, Space } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Issue } from '../services/geminiService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface ReviewReportProps {
  overallScore: number;
  summary: string;
  issues: Issue[];
  recommendations: string[];
}

const ReviewReport: React.FC<ReviewReportProps> = ({ overallScore, summary, issues, recommendations }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'major':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'minor':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'major':
        return 'warning';
      case 'minor':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '致命';
      case 'major':
        return '重要';
      case 'minor':
        return '轻微';
      default:
        return severity;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const majorIssues = issues.filter(i => i.severity === 'major');
  const minorIssues = issues.filter(i => i.severity === 'minor');

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Title level={3}>综合评分</Title>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 64, fontWeight: 'bold', color: getScoreColor(overallScore) }}>
            {overallScore}
          </div>
          <Text type="secondary">分 / 100分</Text>
        </div>
        <Paragraph>{summary}</Paragraph>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>问题统计</Title>
        <Space size="large">
          <div>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
            <Text style={{ marginLeft: 8 }}>致命问题: {criticalIssues.length}</Text>
          </div>
          <div>
            <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
            <Text style={{ marginLeft: 8 }}>重要问题: {majorIssues.length}</Text>
          </div>
          <div>
            <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <Text style={{ marginLeft: 8 }}>轻微问题: {minorIssues.length}</Text>
          </div>
        </Space>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>问题详情</Title>
        <Collapse accordion>
          {issues.map((issue, index) => (
            <Panel
              header={
                <Space>
                  {getSeverityIcon(issue.severity)}
                  <Text strong>{issue.category}</Text>
                  <Tag color={getSeverityColor(issue.severity)}>{getSeverityText(issue.severity)}</Tag>
                  <Text type="secondary">{issue.location}</Text>
                </Space>
              }
              key={index}
            >
              <Paragraph>
                <Text strong>问题描述：</Text>
                <br />
                {issue.description}
              </Paragraph>
              <Paragraph>
                <Text strong>修改建议：</Text>
                <br />
                {issue.suggestion}
              </Paragraph>
            </Panel>
          ))}
        </Collapse>
      </Card>

      <Card>
        <Title level={4}>改进建议</Title>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>
              <Paragraph>{rec}</Paragraph>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ReviewReport;
