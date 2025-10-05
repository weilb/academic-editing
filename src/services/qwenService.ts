const API_KEY = 'sk-6a2594384d3346e39aee54525a2f2306';
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export interface ReviewResult {
  overallScore: number;
  issues: Issue[];
  summary: string;
  recommendations: string[];
}

export interface Issue {
  category: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  location: string;
  suggestion: string;
}

export async function reviewPaper(paperContent: string): Promise<ReviewResult> {
  const prompt = `
你是一位专业的医学期刊审稿人。请仔细审核以下医学论文，并提供详细的反馈。

请从以下维度进行评估：
1. **结构规范性**：标题、摘要、引言、方法、结果、讨论、结论、参考文献是否完整
2. **学术质量**：研究设计、数据分析、逻辑性、创新性
3. **方法论**：研究方法是否科学、样本量是否充足、统计方法是否合适
4. **伦理合规**：是否提及伦理批准、知情同意
5. **数据完整性**：数据是否充分支持结论
6. **语言质量**：表达是否清晰、专业术语使用是否准确
7. **引用规范**：参考文献格式、引用是否充分

论文内容：
${paperContent}

请以JSON格式返回审核结果，格式如下：
{
  "overallScore": 85,
  "summary": "整体评价摘要",
  "issues": [
    {
      "category": "方法论",
      "severity": "major",
      "description": "问题描述",
      "location": "方法部分",
      "suggestion": "具体修改建议"
    }
  ],
  "recommendations": ["建议1", "建议2", "建议3"]
}

严重程度分为：critical（严重问题，必须修改）、major（重要问题，强烈建议修改）、minor（轻微问题，建议优化）
`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API 调用失败: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // 提取JSON内容
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const reviewResult: ReviewResult = JSON.parse(jsonMatch[0]);
      return reviewResult;
    }

    throw new Error('无法解析AI响应');
  } catch (error) {
    console.error('Qwen API调用失败:', error);
    throw error;
  }
}

export async function getSuggestionForIssue(issue: Issue, context: string): Promise<string> {
  const prompt = `
作为医学期刊审稿人，针对以下问题提供详细的修改建议和示例：

问题类别：${issue.category}
严重程度：${issue.severity}
问题描述：${issue.description}
位置：${issue.location}

相关上下文：
${context}

请提供：
1. 详细的修改建议
2. 具体的修改示例（如果适用）
3. 相关的学术规范参考
`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API 调用失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('获取建议失败:', error);
    throw error;
  }
}
