// @ts-ignore
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function parseDocument(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'pdf') {
    return parsePDF(file);
  } else if (fileType === 'docx' || fileType === 'doc') {
    return parseWord(file);
  } else if (fileType === 'txt') {
    return parseText(file);
  } else {
    throw new Error('不支持的文件格式。请上传 PDF、Word 或 TXT 文件。');
  }
}

async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  } catch (error) {
    console.error('PDF解析失败:', error);
    throw new Error('PDF文件解析失败，请确保文件未损坏。');
  }
}

async function parseWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Word解析失败:', error);
    throw new Error('Word文件解析失败，请确保文件未损坏。');
  }
}

async function parseText(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    console.error('文本解析失败:', error);
    throw new Error('文本文件解析失败。');
  }
}

export function analyzePaperStructure(content: string): {
  hasTitle: boolean;
  hasAbstract: boolean;
  hasIntroduction: boolean;
  hasMethods: boolean;
  hasResults: boolean;
  hasDiscussion: boolean;
  hasConclusion: boolean;
  hasReferences: boolean;
  wordCount: number;
} {
  return {
    hasTitle: content.split('\n')[0].length < 200, // 假设标题在第一行且较短
    hasAbstract: /abstract|摘要/i.test(content),
    hasIntroduction: /introduction|引言|背景/i.test(content),
    hasMethods: /method|材料与方法|研究方法/i.test(content),
    hasResults: /result|结果/i.test(content),
    hasDiscussion: /discussion|讨论/i.test(content),
    hasConclusion: /conclusion|结论/i.test(content),
    hasReferences: /reference|参考文献|bibliography/i.test(content),
    wordCount: content.split(/\s+/).length,
  };
}
