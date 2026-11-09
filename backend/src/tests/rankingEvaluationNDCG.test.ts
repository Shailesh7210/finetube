/**
 * Blueprint Section 17.1: Offline Ranking Evaluation (NDCG@K and Precision@K)
 * Validates that FineTube's Bayesian confidence-adjusted ranking formula
 * orders educational videos in accordance with learner consensus and topic depth.
 */

import { calculateBayesianRating, calculateTopicScore } from '../services/rankingService.js';

function dcgAtK(relevances: number[], k: number): number {
  let dcg = 0;
  for (let i = 0; i < Math.min(relevances.length, k); i++) {
    const rel = relevances[i];
    dcg += (Math.pow(2, rel) - 1) / Math.log2(i + 2);
  }
  return dcg;
}

function ndcgAtK(actualRelevances: number[], idealRelevances: number[], k: number): number {
  const dcg = dcgAtK(actualRelevances, k);
  const idcg = dcgAtK(idealRelevances, k);
  if (idcg === 0) return 0;
  return Number((dcg / idcg).toFixed(4));
}

function precisionAtK(actualRelevances: number[], threshold: number, k: number): number {
  const topK = actualRelevances.slice(0, k);
  const relevantCount = topK.filter(r => r >= threshold).length;
  return Number((relevantCount / k).toFixed(4));
}

function assert(condition: boolean, metricName: string, detail: string) {
  if (!condition) {
    console.error(`❌ FAILED [${metricName}]: ${detail}`);
    process.exit(1);
  }
  console.log(`✅ PASSED [${metricName}]: ${detail}`);
}

console.log('================================================================');
console.log('FineTube Offline Ranking & NDCG Evaluation Benchmark (Blueprint §17.1)');
console.log('================================================================\n');

// Gold standard candidate dataset for React Hooks
// Relevance scale: 3 = Exceptional (high trust, full coverage), 2 = Strong, 1 = Acceptable, 0 = Irrelevant
const goldCandidates = [
  {
    id: 'vid_1',
    title: 'Learn useEffect in 13 Minutes',
    ratingAverage: 4.88,
    ratingCount: 42,
    creatorTrust: 0.95,
    topicCoverage: [{ conceptId: 'useEffect', conceptName: 'useEffect basics', level: 'demonstrated', confidence: 0.98 }],
    expectedRelevance: 3
  },
  {
    id: 'vid_2',
    title: 'useMemo and useCallback Mastery',
    ratingAverage: 4.91,
    ratingCount: 38,
    creatorTrust: 0.95,
    topicCoverage: [{ conceptId: 'useMemo', conceptName: 'useMemo', level: 'demonstrated', confidence: 0.97 }],
    expectedRelevance: 3
  },
  {
    id: 'vid_3',
    title: 'Newbie React Hook Intro (Single Rating Anomaly)',
    ratingAverage: 5.0,
    ratingCount: 1, // Single 5-star anomaly
    creatorTrust: 0.5,
    topicCoverage: [{ conceptId: 'useState', conceptName: 'useState', level: 'mentioned', confidence: 0.6 }],
    expectedRelevance: 1
  },
  {
    id: 'vid_4',
    title: 'React 18 Overview (Broad Mention)',
    ratingAverage: 4.2,
    ratingCount: 15,
    creatorTrust: 0.8,
    topicCoverage: [{ conceptId: 'useEffect', conceptName: 'useEffect', level: 'mentioned', confidence: 0.5 }],
    expectedRelevance: 2
  }
];

const topic = {
  id: 'react_hooks',
  conceptChecklist: ['useEffect', 'useMemo', 'useState']
};

console.log('--- Step 1: Score & Rank Candidates with TopicScore Formula ---');
const scoredCandidates = goldCandidates.map(c => {
  const scoreData = calculateTopicScore(c, topic);
  return {
    ...c,
    score: scoreData.score,
    bayesianRating: scoreData.bayesianRating
  };
}).sort((a, b) => b.score - a.score);

scoredCandidates.forEach((c, idx) => {
  console.log(`  Rank ${idx + 1}: ${c.title} (Score: ${c.score}, Bayes: ${c.bayesianRating}, Rel: ${c.expectedRelevance})`);
});

// Single 5-star unverified video should NOT beat high-volume vetted videos
assert(
  scoredCandidates[0].id !== 'vid_3',
  'Anomaly Moderation',
  'Single 5.0 rating video with low volume does not beat high-confidence lectures'
);

console.log('\n--- Step 2: Compute NDCG@3 and Precision@2 ---');
const actualRelevances = scoredCandidates.map(c => c.expectedRelevance);
const idealRelevances = [...actualRelevances].sort((a, b) => b - a);

const ndcg3 = ndcgAtK(actualRelevances, idealRelevances, 3);
const precision2 = precisionAtK(actualRelevances, 2, 2);

console.log(`  Calculated NDCG@3: ${ndcg3}`);
console.log(`  Calculated Precision@2 (Relevance >= 2): ${precision2}`);

assert(ndcg3 >= 0.85, 'NDCG@3 Threshold', `NDCG@3 score (${ndcg3}) meets the high quality benchmark (>= 0.85)`);
assert(precision2 === 1.0, 'Precision@2 Threshold', `Top 2 ranked videos are both highly relevant (Precision@2 = 1.0)`);

console.log('\n================================================================');
console.log('Offline Ranking Evaluation Passed with Gold-Standard Accuracy!');
console.log('================================================================');
