import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Space, Row, Col, Divider } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined, DownOutlined, UpOutlined, LinkOutlined } from '@ant-design/icons';
import { Issue, ReviewResult } from '../services/geminiService';
import { ComparisonResult } from '../App';
import { matchIssues, sortIssuesBySeverity } from '../utils/issueMatcher';

const { Title, Text, Paragraph } = Typography;

interface ReviewReportProps {
  reviewResult?: ReviewResult | null;
  comparisonResult?: ComparisonResult | null;
}

const ReviewReport: React.FC<ReviewReportProps> = ({ reviewResult, comparisonResult }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 10);
    };

    const resultPanel = document.querySelector('.result-panel');
    if (resultPanel) {
      resultPanel.addEventListener('scroll', handleScroll);
      return () => resultPanel.removeEventListener('scroll', handleScroll);
    }
  }, [comparisonResult, reviewResult]);

  const toggleIssue = (key: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleOutlined style={{ color: '#d4537b' }} />;
      case 'major':
        return <WarningOutlined style={{ color: '#e8a87c' }} />;
      case 'minor':
        return <InfoCircleOutlined style={{ color: '#85d7ff' }} />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#ffe0e6';
      case 'major':
        return '#fff4e6';
      case 'minor':
        return '#e6f7ff';
      default:
        return '#f0f0f0';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '严重';
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
    if (score >= 60) return '#e8a87c';
    return '#d4537b';
  };

  const renderSingleReport = (result: ReviewResult) => {
    const sortedIssues = sortIssuesBySeverity(result.issues);
    const criticalIssues = sortedIssues.filter(i => i.severity === 'critical');
    const majorIssues = sortedIssues.filter(i => i.severity === 'major');
    const minorIssues = sortedIssues.filter(i => i.severity === 'minor');

    return (
      <div style={{border: "1px solid red"}}>
        <Card bordered={false} className="score-card">
          <div style={{ border: '1px solid red', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text type="secondary" className="score-label">综合评22分</Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="score-value" style={{ color: getScoreColor(result.overallScore) }}>
                {result.overallScore}
              </span>
              <Text type="secondary" className="score-unit">/ 100</Text>
            </div>
          </div>
          <Divider className="score-divider" />
          <Paragraph className="score-summary">{result.summary}</Paragraph>
        </Card>

        <Card bordered={false} className="stats-card">
          <Title level={5} className="section-title">问题统计</Title>
          <Row gutter={16}>
            <Col span={8}>
              <div className="stat-item" style={{ background: '#ffe0e6' }}>
                <ExclamationCircleOutlined className="stat-icon" style={{ color: '#d4537b' }} />
                <div className="stat-number">{criticalIssues.length}</div>
                <Text type="secondary" className="stat-label">严重问题</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="stat-item" style={{ background: '#fff4e6' }}>
                <WarningOutlined className="stat-icon" style={{ color: '#e8a87c' }} />
                <div className="stat-number">{majorIssues.length}</div>
                <Text type="secondary" className="stat-label">重要问题</Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="stat-item" style={{ background: '#e6f7ff' }}>
                <InfoCircleOutlined className="stat-icon" style={{ color: '#85d7ff' }} />
                <div className="stat-number">{minorIssues.length}</div>
                <Text type="secondary" className="stat-label">轻微问题</Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card bordered={false} className="issues-card">
          <Title level={5} className="section-title">问题详情</Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {sortedIssues.map((issue: Issue, index: number) => {
              const key = `single-${index}`;
              const isExpanded = expandedIssues.has(key);
              return (
                <div key={key} className="issue-item" style={{ borderLeftColor: issue.severity === 'critical' ? '#d4537b' : issue.severity === 'major' ? '#e8a87c' : '#85d7ff' }}>
                  <div className="issue-header">
                    <Space size="small">
                      {getSeverityIcon(issue.severity)}
                      <Text strong className="issue-category">{issue.category}</Text>
                      <Tag className={`severity-tag severity-${issue.severity}`}>{getSeverityText(issue.severity)}</Tag>
                    </Space>
                    <Text type="secondary" className="issue-location">{issue.location}</Text>
                  </div>
                  <Paragraph className="issue-description">{issue.description}</Paragraph>
                  <div className="issue-suggestion-toggle" onClick={() => toggleIssue(key)}>
                    <Text className="toggle-text">
                      {isExpanded ? '收起建议' : '查看修改建议'}
                    </Text>
                    {isExpanded ? <UpOutlined /> : <DownOutlined />}
                  </div>
                  {isExpanded && (
                    <div className="issue-suggestion">
                      <Paragraph className="suggestion-content">{issue.suggestion}</Paragraph>
                    </div>
                  )}
                </div>
              );
            })}
          </Space>
        </Card>

        <Card bordered={false} className="recommendations-card">
          <Title level={5} className="section-title">改进建议</Title>
          <ul className="recommendations-list">
            {result.recommendations.map((rec: string, index: number) => (
              <li key={index} className="recommendation-item">
                <Text className="recommendation-text">{rec}</Text>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  // 单个模型的审核结果
  if (reviewResult) {
    return renderSingleReport(reviewResult);
  }

  // 双模型对比 - 并排展示
  if (comparisonResult && comparisonResult.gemini && comparisonResult.qwen) {
    const gemini = comparisonResult.gemini;
    const qwen = comparisonResult.qwen;

    // 排序问题
    const sortedGeminiIssues = sortIssuesBySeverity(gemini.issues);
    const sortedQwenIssues = sortIssuesBySeverity(qwen.issues);

    // 匹配问题
    const { matched, unmatched1, unmatched2 } = matchIssues(sortedGeminiIssues, sortedQwenIssues);

    return (
      <div>
        {/* 模型名称 */}
        <div className={`model-header ${isScrolled ? 'scrolled' : ''}`}>
          <Row gutter={16}>
            <Col span={12}>
              <div className="model-name-header">
                <Title level={4} className="model-name">Gemini 2.0 Flash</Title>
              </div>
            </Col>
            <Col span={12}>
              <div className="model-name-header">
                <Title level={4} className="model-name">Qwen Max</Title>
              </div>
            </Col>
          </Row>
        </div>

        {/* 综合评分对比 */}
        <Card bordered={false} className="comparison-card comparison-card2"  >
          <Title level={5} className="section-title">综合评分</Title>
          <Row gutter={16}>
            <Col span={12}>
              <div className="score-box">
                <div className="score-value" style={{ color: getScoreColor(gemini.overallScore) }}>
                  {gemini.overallScore}
                </div>
                <Text type="secondary" className="score-unit">/ 100</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className="score-box">
                <div className="score-value" style={{ color: getScoreColor(qwen.overallScore) }}>
                  {qwen.overallScore}
                </div>
                <Text type="secondary" className="score-unit">/ 100</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 评价总结对比 */}
        <Card bordered={false} className="comparison-card">
          <Title level={5} className="section-title">评价总结</Title>
          <Row gutter={16}>
            <Col span={12}>
              <div className="summary-box">
                <Paragraph className="summary-text">{gemini.summary}</Paragraph>
              </div>
            </Col>
            <Col span={12}>
              <div className="summary-box">
                <Paragraph className="summary-text">{qwen.summary}</Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 问题统计对比 */}
        <Card bordered={false} className="comparison-card">
          <Title level={5} className="section-title">问题统计</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Row gutter={8}>
                <Col span={8}>
                  <div className="stat-box critical">
                    <div className="stat-number">{gemini.issues.filter(i => i.severity === 'critical').length}</div>
                    <Text type="secondary" className="stat-label">严重</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="stat-box major">
                    <div className="stat-number">{gemini.issues.filter(i => i.severity === 'major').length}</div>
                    <Text type="secondary" className="stat-label">重要</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="stat-box minor">
                    <div className="stat-number">{gemini.issues.filter(i => i.severity === 'minor').length}</div>
                    <Text type="secondary" className="stat-label">轻微</Text>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={8}>
                <Col span={8}>
                  <div className="stat-box critical">
                    <div className="stat-number">{qwen.issues.filter(i => i.severity === 'critical').length}</div>
                    <Text type="secondary" className="stat-label">严重</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="stat-box major">
                    <div className="stat-number">{qwen.issues.filter(i => i.severity === 'major').length}</div>
                    <Text type="secondary" className="stat-label">重要</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="stat-box minor">
                    <div className="stat-number">{qwen.issues.filter(i => i.severity === 'minor').length}</div>
                    <Text type="secondary" className="stat-label">轻微</Text>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* 问题详情对比 */}
        <Card bordered={false} className="comparison-card">
          <Title level={5} className="section-title">
            问题详情
            <Text type="secondary" style={{ fontSize: 13, fontWeight: 'normal', marginLeft: 12 }}>
              <LinkOutlined /> 标记为相同问题的项目会高亮显示
            </Text>
          </Title>

          {/* 匹配的问题 */}
          {matched.map((match, index) => {
            const key = `matched-${index}`;
            const isExpanded = expandedIssues.has(key);
            return (
              <div key={key} className="matched-issue-pair">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="issue-item matched" style={{ borderLeftColor: match.issue1.severity === 'critical' ? '#d4537b' : match.issue1.severity === 'major' ? '#e8a87c' : '#85d7ff' }}>
                      <div className="match-indicator">
                        <LinkOutlined style={{ color: '#d4537b', fontSize: 12 }} />
                        <Text style={{ fontSize: 11, color: '#999', marginLeft: 4 }}>相同问题</Text>
                      </div>
                      <div className="issue-header">
                        <Space size="small">
                          {getSeverityIcon(match.issue1.severity)}
                          <Text strong className="issue-category">{match.issue1.category}</Text>
                          <Tag className={`severity-tag severity-${match.issue1.severity}`}>{getSeverityText(match.issue1.severity)}</Tag>
                        </Space>
                        <Text type="secondary" className="issue-location">{match.issue1.location}</Text>
                      </div>
                      <Paragraph className="issue-description">{match.issue1.description}</Paragraph>
                      <div className="issue-suggestion-toggle" onClick={() => toggleIssue(key + '-gemini')}>
                        <Text className="toggle-text">
                          {expandedIssues.has(key + '-gemini') ? '收起建议' : '查看修改建议'}
                        </Text>
                        {expandedIssues.has(key + '-gemini') ? <UpOutlined /> : <DownOutlined />}
                      </div>
                      {expandedIssues.has(key + '-gemini') && (
                        <div className="issue-suggestion">
                          <Paragraph className="suggestion-content">{match.issue1.suggestion}</Paragraph>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="issue-item matched" style={{ borderLeftColor: match.issue2.severity === 'critical' ? '#d4537b' : match.issue2.severity === 'major' ? '#e8a87c' : '#85d7ff' }}>
                      <div className="match-indicator">
                        <LinkOutlined style={{ color: '#d4537b', fontSize: 12 }} />
                        <Text style={{ fontSize: 11, color: '#999', marginLeft: 4 }}>相同问题</Text>
                      </div>
                      <div className="issue-header">
                        <Space size="small">
                          {getSeverityIcon(match.issue2.severity)}
                          <Text strong className="issue-category">{match.issue2.category}</Text>
                          <Tag className={`severity-tag severity-${match.issue2.severity}`}>{getSeverityText(match.issue2.severity)}</Tag>
                        </Space>
                        <Text type="secondary" className="issue-location">{match.issue2.location}</Text>
                      </div>
                      <Paragraph className="issue-description">{match.issue2.description}</Paragraph>
                      <div className="issue-suggestion-toggle" onClick={() => toggleIssue(key + '-qwen')}>
                        <Text className="toggle-text">
                          {expandedIssues.has(key + '-qwen') ? '收起建议' : '查看修改建议'}
                        </Text>
                        {expandedIssues.has(key + '-qwen') ? <UpOutlined /> : <DownOutlined />}
                      </div>
                      {expandedIssues.has(key + '-qwen') && (
                        <div className="issue-suggestion">
                          <Paragraph className="suggestion-content">{match.issue2.suggestion}</Paragraph>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}

          {/* 未匹配的问题 */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {unmatched1.map((issue: Issue, index: number) => {
                  const key = `unmatched1-${index}`;
                  return (
                    <div key={key} className="issue-item" style={{ borderLeftColor: issue.severity === 'critical' ? '#d4537b' : issue.severity === 'major' ? '#e8a87c' : '#85d7ff' }}>
                      <div className="issue-header">
                        <Space size="small">
                          {getSeverityIcon(issue.severity)}
                          <Text strong className="issue-category">{issue.category}</Text>
                          <Tag className={`severity-tag severity-${issue.severity}`}>{getSeverityText(issue.severity)}</Tag>
                        </Space>
                        <Text type="secondary" className="issue-location">{issue.location}</Text>
                      </div>
                      <Paragraph className="issue-description">{issue.description}</Paragraph>
                      <div className="issue-suggestion-toggle" onClick={() => toggleIssue(key)}>
                        <Text className="toggle-text">
                          {expandedIssues.has(key) ? '收起建议' : '查看修改建议'}
                        </Text>
                        {expandedIssues.has(key) ? <UpOutlined /> : <DownOutlined />}
                      </div>
                      {expandedIssues.has(key) && (
                        <div className="issue-suggestion">
                          <Paragraph className="suggestion-content">{issue.suggestion}</Paragraph>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {unmatched2.map((issue: Issue, index: number) => {
                  const key = `unmatched2-${index}`;
                  return (
                    <div key={key} className="issue-item" style={{ borderLeftColor: issue.severity === 'critical' ? '#d4537b' : issue.severity === 'major' ? '#e8a87c' : '#85d7ff' }}>
                      <div className="issue-header">
                        <Space size="small">
                          {getSeverityIcon(issue.severity)}
                          <Text strong className="issue-category">{issue.category}</Text>
                          <Tag className={`severity-tag severity-${issue.severity}`}>{getSeverityText(issue.severity)}</Tag>
                        </Space>
                        <Text type="secondary" className="issue-location">{issue.location}</Text>
                      </div>
                      <Paragraph className="issue-description">{issue.description}</Paragraph>
                      <div className="issue-suggestion-toggle" onClick={() => toggleIssue(key)}>
                        <Text className="toggle-text">
                          {expandedIssues.has(key) ? '收起建议' : '查看修改建议'}
                        </Text>
                        {expandedIssues.has(key) ? <UpOutlined /> : <DownOutlined />}
                      </div>
                      {expandedIssues.has(key) && (
                        <div className="issue-suggestion">
                          <Paragraph className="suggestion-content">{issue.suggestion}</Paragraph>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 改进建议对比 */}
        <Card bordered={false} className="comparison-card">
          <Title level={5} className="section-title">改进建议</Title>
          <Row gutter={16}>
            <Col span={12}>
              <ul className="recommendations-list">
                {gemini.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="recommendation-item">
                    <Text className="recommendation-text">{rec}</Text>
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={12}>
              <ul className="recommendations-list">
                {qwen.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="recommendation-item">
                    <Text className="recommendation-text">{rec}</Text>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  return null;
};

export default ReviewReport;

