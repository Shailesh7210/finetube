import { Video, Topic } from './types';

/**
 * Blueprint Section 5.3: Confidence-adjusted rating (Bayesian Average)
 * AdjustedRating = (v / (v + m)) * A + (m / (v + m)) * C
 * @param observedAvg A - observed average rating (1-5)
 * @param ratingCount v - number of valid ratings
 * @param confidenceThreshold m - confidence threshold (default 5.0)
 * @param priorTopicAvg C - prior average for comparable videos (default 4.0)
 */
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

export interface RankingWeights {
  wUser: number;      // 0.55 (55%)
  wAi: number;        // 0.20 (20%)
  wCoverage: number;  // 0.15 (15%)
  wFresh: number;     // 0.05 (5%)
  wTrust: number;     // 0.05 (5%)
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  wUser: 0.55,
  wAi: 0.20,
  wCoverage: 0.15,
  wFresh: 0.05,
  wTrust: 0.05,
};

/**
 * Blueprint Section 5.4: Topic Ranking Score Calculation
 * TopicScore = w_user * normalized_adjusted_user_rating
 *            + w_ai * normalized_ai_topic_quality
 *            + w_coverage * topic_coverage
 *            + w_fresh * freshness_adjustment
 *            + w_trust * source_or_creator_trust
 * Normalized to 0-100 scale
 */
export function calculateTopicScore(
  video: Video,
  targetTopic?: Topic,
  weights: RankingWeights = DEFAULT_WEIGHTS
): { score: number; breakdown: Record<string, number>; reasonCodes: string[] } {
  // 1. Normalized User Rating (1-5 scaled to 0-100)
  const bayesianRating = calculateBayesianRating(video.ratingAverage, video.ratingCount);
  const normalizedUser = Math.min(100, Math.max(0, ((bayesianRating - 1) / 4) * 100));

  // 2. Normalized AI Quality (average of clarity, example quality, completeness)
  const aiQual = video.aiAssessment
    ? (video.aiAssessment.clarity * 0.4 +
       video.aiAssessment.exampleQuality * 0.4 +
       video.aiAssessment.completeness * 0.2)
    : 70;
  const normalizedAi = Math.min(100, Math.max(0, aiQual));

  // 3. Topic Coverage (share of topic concepts demonstrated or explained)
  let coverageRatio = 0.8;
  if (targetTopic && targetTopic.conceptChecklist.length > 0) {
    const matchedCount = video.topicCoverage.filter(c => 
      c.level === 'explained' || c.level === 'demonstrated'
    ).length;
    coverageRatio = Math.min(1.0, matchedCount / Math.max(1, targetTopic.conceptChecklist.length));
  }
  const normalizedCoverage = coverageRatio * 100;

  // 4. Freshness adjustment (videos published within 18 months get slight boost, not overpenalizing evergreen content)
  const pubDate = new Date(video.publishedAt).getTime();
  const ageMonths = (Date.now() - pubDate) / (1000 * 60 * 60 * 24 * 30.4);
  let freshnessScore = 80;
  if (ageMonths <= 6) freshnessScore = 100;
  else if (ageMonths <= 18) freshnessScore = 90;
  else if (ageMonths <= 36) freshnessScore = 80;
  else freshnessScore = 70;

  // 5. Creator Trust
  const normalizedTrust = Math.min(100, Math.max(0, video.creatorTrust * 100));

  // Weighted sum
  const finalScore = Math.round(
    weights.wUser * normalizedUser +
    weights.wAi * normalizedAi +
    weights.wCoverage * normalizedCoverage +
    weights.wFresh * freshnessScore +
    weights.wTrust * normalizedTrust
  );

  // Generate explainable reason codes (Section 5.6)
  const reasons: string[] = [];
  if (bayesianRating >= 4.7) reasons.push("Top community-rated explanation");
  else if (bayesianRating >= 4.3) reasons.push("Highly rated by learners");

  if (video.aiAssessment.exampleQuality >= 85) reasons.push("Strong practical code examples");
  if (coverageRatio >= 0.75) reasons.push("Comprehensive topic coverage");
  if (video.ratingCount < 5) reasons.push("Rising new content");
  if (video.aiAssessment.clarity >= 90) reasons.push("Exceptional pedagogical clarity");

  return {
    score: Math.min(99, Math.max(1, finalScore)),
    breakdown: {
      userRating: Math.round(normalizedUser),
      aiQuality: Math.round(normalizedAi),
      coverage: Math.round(normalizedCoverage),
      freshness: Math.round(freshnessScore),
      trust: Math.round(normalizedTrust)
    },
    reasonCodes: reasons.slice(0, 3)
  };
}
