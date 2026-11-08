import { calculateBayesianRating, calculateTopicScore } from '../services/rankingService.js';
import { answerGroundedQuestion, generateConceptQuizForVideo } from '../services/aiService.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('====================================================');
console.log('FineTube Quality & Verification Test Suite (Blueprint §17)');
console.log('====================================================\n');

// 1. Test Bayesian Confidence-Adjusted Rating Formula (Blueprint Section 5.3)
console.log('--- Testing Bayesian Ranking Engine ---');
const unratedVideoAvg = calculateBayesianRating(5.0, 1);
const reliableVideoAvg = calculateBayesianRating(4.9, 50);

// With only 1 rating of 5.0, score must be pulled toward prior mean (4.0) with confidence threshold m=5
assert(unratedVideoAvg < 4.5, `Single 5-star rating is moderated towards topic prior (got ${unratedVideoAvg})`);
assert(reliableVideoAvg > 4.7, `High-volume 4.9 rating retains confidence (got ${reliableVideoAvg})`);

// 2. Test Topic Score Weights (Blueprint Section 5.4)
const sampleVideo = {
  id: 'vid_test',
  ratingAverage: 4.8,
  ratingCount: 30,
  creatorTrust: 0.95,
  topicCoverage: [
    { conceptId: 'useState', conceptName: 'State hook', level: 'demonstrated', confidence: 0.95 }
  ],
  aiAssessment: {
    clarity: 92,
    accuracyEvidence: 90,
    exampleQuality: 95,
    completeness: 85
  }
};

const sampleTopic = {
  id: 'react_hooks',
  conceptChecklist: ['useState', 'useEffect']
};

const scoreResult = calculateTopicScore(sampleVideo, sampleTopic);
assert(scoreResult.score >= 1 && scoreResult.score <= 100, `TopicScore produces valid [1, 100] percentile ranking (got ${scoreResult.score})`);
assert(scoreResult.bayesianRating >= 1.0 && scoreResult.bayesianRating <= 5.0, `Bayesian rating is bounded [1, 5] (got ${scoreResult.bayesianRating})`);

// 3. Test Grounded AI Anti-Hallucination Boundaries (Blueprint Section 13.2 & 17.2)
console.log('\n--- Testing Grounded AI Verification Gates ---');
const videoReact = {
  id: 'vid_react_useeffect',
  title: 'Learn useEffect In 13 Minutes',
  chapters: [
    { title: 'Cleanup functions & Component Unmount', start: 540, end: 832 }
  ],
  topicCoverage: [
    { conceptId: 'useEffect', conceptName: 'useEffect basics', level: 'demonstrated', confidence: 0.98 }
  ]
};

// Test valid grounded query
const inScopeAnswer = answerGroundedQuestion(videoReact, 'How do cleanup functions work?');
assert(inScopeAnswer.isCoveredInVideo === true, 'Grounded answer identifies in-scope concepts');
assert(inScopeAnswer.citations.length > 0, 'Grounded answer includes verifiable timestamp citations');
assert(inScopeAnswer.citations[0].timestampSeconds === 540, 'Citation points to exact matching chapter timestamp');

// Test out-of-scope query (Must NOT hallucinate per Section 13.2)
const outOfScopeAnswer = answerGroundedQuestion(videoReact, 'What is the stock market valuation of Apple?');
assert(outOfScopeAnswer.isCoveredInVideo === false, 'AI acknowledges content boundaries for unrelated concepts');
assert(outOfScopeAnswer.answer.includes('does not directly discuss'), 'AI explicitly refuses to invent evidence for uncovered concepts');

// 4. Test Concept Quiz Quality Gates (Blueprint Section 13.0 & 17.2)
console.log('\n--- Testing Concept Quiz Verification Gates ---');
const quiz = generateConceptQuizForVideo(videoReact);
assert(quiz.questions.length >= 3, `Generated quiz contains comprehensive concept checks (got ${quiz.questions.length})`);

quiz.questions.forEach((q, idx) => {
  assert(q.options.length === 4, `Question ${idx + 1} has exactly 4 candidate options`);
  assert(q.correctIndex >= 0 && q.correctIndex < 4, `Question ${idx + 1} correctIndex is valid`);
  assert(q.citationTimestamp >= 0 && q.citationTimestamp <= 832, `Question ${idx + 1} citation falls within video duration bounds`);
  assert(q.explanation.length > 10, `Question ${idx + 1} includes clear evidence-backed explanation`);
});

console.log('\n====================================================');
console.log('All Quality & Verification Gates Passed Successfully!');
console.log('====================================================');
