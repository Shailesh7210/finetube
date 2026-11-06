export function calculateBayesianRating(
  observedAvg: number,
  ratingCount: number,
  confidenceThreshold: number = 5,
  priorTopicAvg: number = 4.0
): number {
  if (ratingCount === 0) return priorTopicAvg;
  const v = ratingCount;
  const m = confidenceThreshold;
  const A = observedAvg;
  const C = priorTopicAvg;
  const adjusted = (v / (v + m)) * A + (m / (v + m)) * C;
  return Number(adjusted.toFixed(2));
}

export function calculateTopicScore(video: any, targetTopic?: any) {
  const bayesianRating = calculateBayesianRating(video.ratingAverage || 4.5, video.ratingCount || 1);
  const normalizedUser = Math.min(100, Math.max(0, ((bayesianRating - 1) / 4) * 100));

  const aiQual = video.aiAssessment
    ? (video.aiAssessment.clarity * 0.4 +
       video.aiAssessment.exampleQuality * 0.4 +
       video.aiAssessment.completeness * 0.2)
    : 75;
  const normalizedAi = Math.min(100, Math.max(0, aiQual));

  let coverageRatio = 0.8;
  if (targetTopic && targetTopic.conceptChecklist && targetTopic.conceptChecklist.length > 0) {
    const matchedCount = (video.topicCoverage || []).filter((c: any) => 
      c.level === 'explained' || c.level === 'demonstrated'
    ).length;
    coverageRatio = Math.min(1.0, matchedCount / Math.max(1, targetTopic.conceptChecklist.length));
  }
  const normalizedCoverage = coverageRatio * 100;

  const pubDate = new Date(video.publishedAt || Date.now()).getTime();
  const ageMonths = (Date.now() - pubDate) / (1000 * 60 * 60 * 24 * 30.4);
  let freshnessScore = 80;
  if (ageMonths <= 6) freshnessScore = 100;
  else if (ageMonths <= 18) freshnessScore = 90;

  const normalizedTrust = Math.min(100, Math.max(0, (video.creatorTrust || 0.9) * 100));

  const score = Math.round(
    0.55 * normalizedUser +
    0.20 * normalizedAi +
    0.15 * normalizedCoverage +
    0.05 * freshnessScore +
    0.05 * normalizedTrust
  );

  return {
    score: Math.min(99, Math.max(1, score)),
    bayesianRating
  };
}
