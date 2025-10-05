import { Issue } from '../services/geminiService';

// 计算两个字符串的相似度（简单的Jaccard相似度）
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set(Array.from(words1).filter(x => words2.has(x)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);

  return intersection.size / union.size;
}

// 匹配两个模型的相似问题
export function matchIssues(issues1: Issue[], issues2: Issue[]): {
  matched: Array<{ issue1: Issue; issue2: Issue; similarity: number }>;
  unmatched1: Issue[];
  unmatched2: Issue[];
} {
  const matched: Array<{ issue1: Issue; issue2: Issue; similarity: number }> = [];
  const used2 = new Set<number>();
  const unmatched1: Issue[] = [];

  // 为每个issue1找最相似的issue2
  issues1.forEach(issue1 => {
    let bestMatch = -1;
    let bestSimilarity = 0;

    issues2.forEach((issue2, index) => {
      if (used2.has(index)) return;

      // 综合考虑类别和描述的相似度
      const categorySimilarity = issue1.category === issue2.category ? 1 : 0;
      const descSimilarity = calculateSimilarity(issue1.description, issue2.description);
      const locationSimilarity = calculateSimilarity(issue1.location, issue2.location);

      // 加权计算总相似度
      const totalSimilarity = categorySimilarity * 0.4 + descSimilarity * 0.4 + locationSimilarity * 0.2;

      if (totalSimilarity > bestSimilarity && totalSimilarity > 0.3) { // 阈值0.3
        bestSimilarity = totalSimilarity;
        bestMatch = index;
      }
    });

    if (bestMatch !== -1) {
      matched.push({
        issue1,
        issue2: issues2[bestMatch],
        similarity: bestSimilarity
      });
      used2.add(bestMatch);
    } else {
      unmatched1.push(issue1);
    }
  });

  // 收集未匹配的issue2
  const unmatched2 = issues2.filter((_, index) => !used2.has(index));

  return { matched, unmatched1, unmatched2 };
}

// 按重要程度排序问题
export function sortIssuesBySeverity(issues: Issue[]): Issue[] {
  const severityOrder: { [key: string]: number } = {
    critical: 3,
    major: 2,
    minor: 1
  };

  return [...issues].sort((a, b) => {
    const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    if (severityDiff !== 0) return severityDiff;

    // 相同严重程度按类别排序
    return a.category.localeCompare(b.category);
  });
}
