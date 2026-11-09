/**
 * FineTube Dynamic YouTube Discovery & Quota Caching Test Suite
 * Validates YouTube Data API v3 parsing, ISO 8601 duration handling,
 * multi-subject discovery (Class 12, Medical, CS, History), TTL caching,
 * and quota protection gates.
 */

import { youtubeService, parseYouTubeDuration } from '../services/youtubeService.js';

function assert(condition: boolean, testName: string, detail: string = '') {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('FineTube Dynamic YouTube Discovery & Quota Suite (Blueprint §4 & §11)');
  console.log('================================================================\n');

  // Gate 1: ISO 8601 Duration Parser
  console.log('--- Gate 1: ISO 8601 Video Duration Parsing ---');
  assert(parseYouTubeDuration('PT13M') === 780, 'Parses 13 minutes accurately (got 780s)');
  assert(parseYouTubeDuration('PT1H2M30S') === 3750, 'Parses 1 hour 2 mins 30 secs accurately (got 3750s)');
  assert(parseYouTubeDuration('PT45S') === 45, 'Parses 45 seconds accurately (got 45s)');
  assert(parseYouTubeDuration('P1DT2H') === 93600, 'Parses day and hour format accurately');
  assert(parseYouTubeDuration('') === 0, 'Handles empty string gracefully (0s)');

  // Gate 2: Class 12 Science Student Query Discovery
  console.log('\n--- Gate 2: Class 12 Science Discovery ---');
  const class12Result = await youtubeService.searchEducationalVideos('Class 12 Physics Electrostatics', {
    educationLevel: 'Class 12'
  });
  assert(class12Result.data.length > 0, 'Discovered videos for "Class 12 Physics Electrostatics"');
  const firstPhysics = class12Result.data[0];
  assert(firstPhysics.canonicalUrl.startsWith('https://www.youtube.com/watch?v='), 'Embeddable canonical YouTube link generated');
  assert(firstPhysics.provider === 'youtube', 'Provider set to official YouTube');
  assert(firstPhysics.durationSeconds > 0, 'Valid video duration extracted');

  // Gate 3: Medical Student Query Discovery
  console.log('\n--- Gate 3: Medical Student Discovery ---');
  const medicalResult = await youtubeService.searchEducationalVideos('Human cardiovascular system', {
    educationLevel: 'Medical Studies'
  });
  assert(medicalResult.data.length > 0, 'Discovered videos for "Human cardiovascular system"');
  assert(medicalResult.data.some(v => v.primaryTopicId === 'med_cardiovascular_physiology' || v.title.toLowerCase().includes('cardio')), 'Appropriately mapped to cardiovascular curriculum');

  // Gate 4: History & Humanities Query Discovery
  console.log('\n--- Gate 4: History & Humanities Discovery ---');
  const historyResult = await youtubeService.searchEducationalVideos('French Revolution');
  assert(historyResult.data.length > 0, 'Discovered videos for "French Revolution"');
  assert(historyResult.data[0].title.toLowerCase().includes('french revolution'), 'Discovered high-relevance French Revolution content');

  // Gate 5: Computer Science Query Discovery
  console.log('\n--- Gate 5: Software Developer Discovery ---');
  const csResult = await youtubeService.searchEducationalVideos('React useEffect');
  assert(csResult.data.length > 0, 'Discovered videos for "React useEffect"');
  assert(csResult.data[0].primaryTopicId === 'react_hooks', 'Preserved software engineering classification');

  // Gate 6: Novel Topic Dynamic Discovery (Zero Admin Dependency)
  console.log('\n--- Gate 6: Novel Query Dynamic Discovery ---');
  const novelResult = await youtubeService.searchEducationalVideos('Quantum Entanglement Superposition');
  assert(novelResult.data.length > 0, 'Successfully discovered videos for previously unsearched topic');
  assert(novelResult.data[0].chapters.length > 0, 'Synthesized verifiable learning progression chapters');

  // Gate 7: TTL Search Caching & Quota Conservation
  console.log('\n--- Gate 7: TTL Search Caching & Quota Protection ---');
  const initialQuota = youtubeService.getQuotaStats();
  // Second search with identical query must be served from cache
  const cachedResult = await youtubeService.searchEducationalVideos('Class 12 Physics Electrostatics', {
    educationLevel: 'Class 12'
  });
  assert(cachedResult.cached === true, 'Repeated search query is served directly from TTL cache');
  assert(cachedResult.source === 'cache', 'Response source marked as cache');
  const postQuota = youtubeService.getQuotaStats();
  assert(postQuota.dailyEstimatedQuotaLimit === 10000, 'Quota monitor enforces 10,000 daily points budget');

  console.log('\n================================================================');
  console.log('Dynamic YouTube Discovery & Quota Suite Passed Successfully!');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
