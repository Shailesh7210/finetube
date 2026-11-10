/**
 * FineTube AI Video Classification Verification Suite (Blueprint §6)
 * Validates multi-topic AI categorization, confidence scores,
 * subtopic extraction, ambiguity flagging, and admin correction mechanisms.
 */

import { classifyVideoMetadata } from '../services/aiService.js';
import { taxonomyRegistry } from '../services/taxonomyService.js';

function assert(condition: boolean, testName: string, detail: string = '') {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('================================================================');
console.log('FineTube AI Video Classification Suite (Blueprint §6)');
console.log('================================================================\n');

// Test Case 1: Chemistry & Organic Chemistry Reaction Mechanisms (From Blueprint Spec)
console.log('--- Test Case 1: Organic Chemistry Classification ---');
const chemResult = classifyVideoMetadata({
  title: 'Complete Organic Chemistry Reaction Mechanism (SN1, SN2, E1, E2)',
  description: 'Master reaction mechanisms, carbocation stability, nucleophilic substitution and elimination pathways in organic chemistry.',
  tags: ['Organic Chemistry', 'Reaction Mechanisms', 'Chemistry']
});

assert(chemResult.mainSubject.id === 'chemistry', `Main subject classified as Chemistry (got ${chemResult.mainSubject.id})`);
assert(chemResult.primaryTopic.id === 'chem_organic_reactions', `Primary topic classified as chem_organic_reactions (got ${chemResult.primaryTopic.id})`);
assert(chemResult.confidenceScore >= 0.85, `High confidence score generated (got ${chemResult.confidenceScore})`);
assert(chemResult.needsHumanReview === false, 'High confidence video does not require human review');
assert(chemResult.relatedConcepts.length > 0, `Related concepts extracted: ${chemResult.relatedConcepts.join(', ')}`);

// Test Case 2: Class 12 Physics (Electrostatics & Coulomb Law)
console.log('\n--- Test Case 2: Class 12 Physics Classification ---');
const physicsResult = classifyVideoMetadata({
  title: 'Class 12 Physics: Electrostatics & Coulomb\'s Law in One Shot',
  description: 'Full lecture on electric charges, Coulomb law vector form, superposition principle, and Gauss theorem.',
  tags: ['Class 12 Physics', 'Electrostatics']
});

assert(physicsResult.mainSubject.id === 'physics', `Main subject classified as Physics (got ${physicsResult.mainSubject.id})`);
assert(physicsResult.primaryTopic.id === 'physics_electrostatics', `Primary topic classified as physics_electrostatics`);
assert(physicsResult.confidenceScore >= 0.85, `High confidence score generated (got ${physicsResult.confidenceScore})`);
assert(physicsResult.needsHumanReview === false, 'High confidence physics lecture auto-approved');

// Test Case 3: Medical Science (Human Cardiovascular System)
console.log('\n--- Test Case 3: Medical Science Classification ---');
const cardioResult = classifyVideoMetadata({
  title: 'Cardiovascular System: Anatomy, Heart Chambers & Blood Flow',
  description: 'Clinical anatomy and physiology of human cardiac chambers, valves, systemic vs pulmonary circulation.',
  tags: ['Cardiovascular System', 'Human Anatomy', 'Medicine']
});

assert(cardioResult.mainSubject.id === 'medical_sciences', `Main subject classified as Medical Sciences (got ${cardioResult.mainSubject.id})`);
assert(cardioResult.primaryTopic.id === 'med_cardiovascular_physiology', `Primary topic classified as cardiovascular physiology`);
assert(cardioResult.confidenceScore >= 0.85, `High confidence score generated (got ${cardioResult.confidenceScore})`);
assert(cardioResult.secondaryTopics.length > 0, 'Multi-topic mapping identifies secondary topic (e.g. human anatomy)');

// Test Case 4: History & Humanities (French Revolution)
console.log('\n--- Test Case 4: Humanities & History Classification ---');
const historyResult = classifyVideoMetadata({
  title: 'The French Revolution: Crash Course World History #29',
  description: 'Causes of the French revolution, storming of the Bastille, Declaration of the Rights of Man, and the Reign of Terror.',
  tags: ['French Revolution', 'History']
});

assert(historyResult.mainSubject.id === 'history', `Main subject classified as History (got ${historyResult.mainSubject.id})`);
assert(historyResult.primaryTopic.id === 'hist_french_revolution', `Primary topic classified as hist_french_revolution`);
assert(historyResult.confidenceScore >= 0.85, `Confidence score generated (got ${historyResult.confidenceScore})`);

// Test Case 5: Ambiguous / Low-Confidence Content (Flags for Review)
console.log('\n--- Test Case 5: Low-Confidence Ambiguity Gate ---');
const ambiguousResult = classifyVideoMetadata({
  title: 'My Morning Routine & Some Random Ramblings',
  description: 'Just chatting about random everyday lifestyle thoughts.'
});

assert(ambiguousResult.confidenceScore < 0.75, `Low confidence score for ambiguous content (got ${ambiguousResult.confidenceScore})`);
assert(ambiguousResult.needsHumanReview === true, 'Ambiguous content properly flagged for admin review');
assert(ambiguousResult.evidenceReason.length > 0, 'Includes explicit evidence reason explaining flag');

console.log('\n================================================================');
console.log('AI Video Classification Suite Passed Successfully!');
console.log('================================================================\n');
