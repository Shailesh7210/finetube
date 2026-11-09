/**
 * FineTube Universal Educational Taxonomy Verification Suite
 * Validates cross-discipline subjects, hierarchical topics, dynamic extensibility,
 * and multi-dimensional educational filtering.
 */

import { taxonomyRegistry, UNIVERSAL_SUBJECTS, UNIVERSAL_TOPICS } from '../services/taxonomyService.js';

function assert(condition: boolean, testName: string, detail: string = '') {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('================================================================');
console.log('FineTube Universal Educational Taxonomy & Extensibility Suite');
console.log('================================================================\n');

// Gate 1: Universal Subjects Breadth
console.log('--- Gate 1: Universal Disciplines & Extensible Subjects ---');
const subjects = taxonomyRegistry.getAllSubjects();
assert(subjects.length >= 10, 'Universal taxonomy contains at least 10 core disciplines (got ' + subjects.length + ')');

const expectedSubjectIds = ['physics', 'chemistry', 'mathematics', 'medical_sciences', 'cs_it', 'history', 'economics_finance', 'psychology'];
for (const subId of expectedSubjectIds) {
  const found = taxonomyRegistry.getSubjectById(subId);
  assert(!!found, `Taxonomy covers essential discipline: ${subId}`);
}

// Gate 2: Dynamic Subject Registration (Runtime Extensibility)
console.log('\n--- Gate 2: Dynamic Subject Registration (Extensibility) ---');
const customSubject = {
  id: 'subj_astrophysics_space',
  slug: 'astrophysics-space-exploration',
  name: 'Astrophysics & Space Science',
  description: 'Planetary science, orbital mechanics, cosmology and space exploration missions',
  category: 'sciences',
  icon: 'Rocket',
  parentSubjectId: 'physics',
  streams: ['Undergraduate', 'General Knowledge'],
  status: 'active' as const,
  order: 99
};
taxonomyRegistry.registerSubject(customSubject);
const registeredSubject = taxonomyRegistry.getSubjectById('subj_astrophysics_space');
assert(registeredSubject !== undefined && registeredSubject.name === 'Astrophysics & Space Science', 'Dynamically registered new subject into taxonomy at runtime without restarts');

// Gate 3: Universal Topics Coverage across Learner Archetypes
console.log('\n--- Gate 3: Universal Learner Archetype Topic Coverage ---');
// Class 12 Science Student topics
const class12Physics = taxonomyRegistry.findTopicByIdOrSlug('physics-electrostatics');
assert(class12Physics !== undefined && class12Physics.educationLevel === 'Class 12', 'Class 12 Physics (Electrostatics) is mapped with proper education level');

const class12Chemistry = taxonomyRegistry.findTopicByIdOrSlug('organic-chemistry-reaction-mechanisms');
assert(class12Chemistry !== undefined && class12Chemistry.stream === 'Science', 'Class 12 Chemistry (Organic Reactions) is mapped with proper Science stream');

// Medical Student topics
const medicalCardio = taxonomyRegistry.findTopicByIdOrSlug('cardiovascular-and-renal-physiology');
assert(medicalCardio !== undefined && medicalCardio.subjectId === 'medical_sciences', 'Medical Physiology (Cardiovascular) is mapped to Medical Science');

// Humanities & History topics
const frenchRev = taxonomyRegistry.findTopicByIdOrSlug('the-french-revolution-and-napoleonic-era');
assert(frenchRev !== undefined && frenchRev.subjectId === 'history', 'French Revolution is mapped to History discipline');

// Software Engineering topics (preserved)
const reactHooks = taxonomyRegistry.findTopicByIdOrSlug('react-hooks');
assert(reactHooks !== undefined && reactHooks.subjectId === 'cs_it', 'Software Engineering (React Hooks) is preserved within CS subject');

// Gate 4: Dynamic Topic Registration (Runtime Extensibility)
console.log('\n--- Gate 4: Dynamic Topic Registration (Extensibility) ---');
const customTopic = {
  id: 'topic_neuroimaging_fmri',
  subjectId: 'medical_sciences',
  parentId: 'med_cardiovascular_physiology',
  slug: 'functional-mri-neuroimaging',
  name: 'Functional Neuroimaging (fMRI)',
  description: 'BOLD hemodynamics, spatial resolution, and cognitive brain mapping',
  aliases: ['fMRI', 'Neuroimaging', 'Brain Mapping'],
  status: 'active' as const,
  conceptChecklist: ['BOLD signal physics', 'Hemodynamic response function', 'Spatial normalization', 'Statistical parametric mapping'],
  educationLevel: 'Postgraduate',
  stream: 'Medical'
};
taxonomyRegistry.registerTopic(customTopic);
const registeredTopic = taxonomyRegistry.findTopicByIdOrSlug('functional-mri-neuroimaging');
assert(registeredTopic !== undefined && registeredTopic.name === 'Functional Neuroimaging (fMRI)', 'Dynamically registered new topic into taxonomy at runtime without code modifications');

// Gate 5: Hierarchical Multi-Dimensional Filtering
console.log('\n--- Gate 5: Multi-Dimensional Educational Filtering ---');
const class12Topics = taxonomyRegistry.filterTopics({ educationLevel: 'Class 12' });
assert(class12Topics.length >= 2, 'Filtered Class 12 educational topics successfully (got ' + class12Topics.length + ')');

const medicalTopics = taxonomyRegistry.filterTopics({ subjectId: 'medical_sciences' });
assert(medicalTopics.length >= 3, 'Filtered Medical Sciences topics successfully (got ' + medicalTopics.length + ')');

const searchByAlias = taxonomyRegistry.filterTopics({ searchQuery: 'coulomb' });
assert(searchByAlias.length >= 1 && searchByAlias[0].id === 'physics_electrostatics', 'Discovered topic via alias search query ("coulomb")');

console.log('\n================================================================');
console.log('Universal Educational Taxonomy Suite Passed Successfully!');
console.log('================================================================\n');
