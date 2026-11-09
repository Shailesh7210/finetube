import { Subject, Topic, Video, Playlist, Folder, Note, UserProfile } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'physics',
    slug: 'physics',
    name: 'Physics',
    description: 'Mechanics, electromagnetism, thermodynamics, optics, quantum theory and astrophysics',
    category: 'sciences',
    icon: 'Atom',
    streams: ['School Class 11-12', 'Undergraduate', 'Competitive Exams', 'General'],
    status: 'active',
    order: 1
  },
  {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Chemistry',
    description: 'Organic reaction mechanisms, physical chemistry, kinetics, and inorganic structures',
    category: 'sciences',
    icon: 'FlaskConical',
    streams: ['School Class 11-12', 'Undergraduate', 'Medical Preparation', 'General'],
    status: 'active',
    order: 2
  },
  {
    id: 'mathematics',
    slug: 'mathematics',
    name: 'Mathematics',
    description: 'Calculus, linear algebra, discrete math, probability, and differential equations',
    category: 'mathematics',
    icon: 'Binary',
    streams: ['School Class 11-12', 'Engineering', 'Higher Mathematics', 'General'],
    status: 'active',
    order: 3
  },
  {
    id: 'biology',
    slug: 'biology',
    name: 'Biology & Life Sciences',
    description: 'Cell biology, genetics, molecular biology, evolution, and ecology',
    category: 'sciences',
    icon: 'Dna',
    streams: ['School Class 11-12', 'Medical Preparation', 'Undergraduate', 'General'],
    status: 'active',
    order: 4
  },
  {
    id: 'medical_sciences',
    slug: 'medical-sciences',
    name: 'Medical Science & Medicine',
    description: 'Human anatomy, clinical physiology, pathology, pharmacology, and cardiology',
    category: 'medical',
    icon: 'Stethoscope',
    streams: ['Medical Studies', 'Clinical Practice', 'Nursing & Allied Health'],
    status: 'active',
    order: 5
  },
  {
    id: 'cs_it',
    slug: 'computer-science',
    name: 'Computer Science & Software',
    description: 'Algorithms, data structures, full-stack engineering, distributed systems and AI',
    category: 'computer_science',
    icon: 'Terminal',
    streams: ['Professional Developers', 'Undergraduate CS', 'Self-Taught'],
    status: 'active',
    order: 6
  },
  {
    id: 'history',
    slug: 'history',
    name: 'History & Civilizations',
    description: 'World history, ancient civilizations, medieval eras, French Revolution and modern history',
    category: 'humanities',
    icon: 'Landmark',
    streams: ['School & College', 'Civil Services Preparation', 'General Knowledge'],
    status: 'active',
    order: 7
  },
  {
    id: 'geography',
    slug: 'geography',
    name: 'Geography & Earth Sciences',
    description: 'Physical geography, climate systems, geomorphology, and oceanography',
    category: 'social_sciences',
    icon: 'Globe',
    streams: ['School Class 11-12', 'Civil Services', 'General Knowledge'],
    status: 'active',
    order: 8
  },
  {
    id: 'economics_finance',
    slug: 'economics-and-finance',
    name: 'Economics & Finance',
    description: 'Microeconomics, macroeconomic policy, monetary theory, and market dynamics',
    category: 'business',
    icon: 'TrendingUp',
    streams: ['Undergraduate', 'Commerce Class 11-12', 'Professionals'],
    status: 'active',
    order: 9
  },
  {
    id: 'psychology',
    slug: 'psychology',
    name: 'Psychology & Cognitive Sciences',
    description: 'Cognitive psychology, behavioral neuroscience, memory models, and decision heuristics',
    category: 'social_sciences',
    icon: 'Brain',
    streams: ['Undergraduate', 'Applied Psychology', 'General Knowledge'],
    status: 'active',
    order: 10
  },
  {
    id: 'law_polity',
    slug: 'law-and-political-science',
    name: 'Law & Political Science',
    description: 'Constitutional law, jurisprudence, international relations, and public policy',
    category: 'humanities',
    icon: 'Scale',
    streams: ['Law Students', 'Civil Services', 'General Learners'],
    status: 'active',
    order: 11
  },
  {
    id: 'general_knowledge',
    slug: 'general-knowledge',
    name: 'General Knowledge & Science',
    description: 'Interdisciplinary science, space exploration, world affairs, and critical thinking',
    category: 'general',
    icon: 'Sparkles',
    streams: ['Lifelong Learners', 'Competitive Exams', 'Curious Explorers'],
    status: 'active',
    order: 12
  }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'react_hooks',
    subjectId: 'cs_it',
    slug: 'react-hooks',
    name: 'React Hooks',
    description: 'State management, side-effects, memoization and reusable custom hooks in modern React',
    aliases: ['React', 'Hooks', 'useEffect', 'useState', 'Custom Hooks'],
    status: 'active',
    conceptChecklist: [
      'useState',
      'useEffect',
      'dependency array',
      'cleanup function',
      'useMemo',
      'useCallback',
      'useRef',
      'custom hooks'
    ],
    videoCount: 8
  },
  {
    id: 'binary_search_trees',
    subjectId: 'cs_it',
    slug: 'binary-search-trees',
    name: 'Binary Search Trees (BST)',
    description: 'Tree data structures, BST invariant properties, search, insertion, deletion and tree traversals',
    aliases: ['BST', 'Binary Tree', 'Trees', 'DSA Trees', 'Data Structures'],
    status: 'active',
    conceptChecklist: [
      'BST property',
      'search operation',
      'node insertion',
      'node deletion (three cases)',
      'in-order traversal',
      'pre/post-order traversal',
      'time complexity (O(log n) vs O(n))',
      'balanced BST overview'
    ],
    videoCount: 6
  },
  {
    id: 'system_design',
    subjectId: 'cs_it',
    slug: 'system-design',
    name: 'System Design Fundamentals',
    description: 'Architecting distributed systems, caching, database sharding, load balancing and CAP theorem',
    aliases: ['System Architecture', 'Distributed Systems', 'Scalability', 'Microservices'],
    status: 'active',
    conceptChecklist: [
      'horizontal vs vertical scaling',
      'load balancers',
      'caching strategies (Redis/Memcached)',
      'database indexing and replication',
      'CAP theorem',
      'message queues (Kafka/RabbitMQ)',
      'rate limiting'
    ],
    videoCount: 5
  },
  {
    id: 'async_javascript',
    subjectId: 'cs_it',
    slug: 'async-javascript',
    name: 'Async JavaScript & Event Loop',
    description: 'Deep dive into asynchronous programming, Promises, async/await, call stack and event loop microtasks',
    aliases: ['JavaScript Async', 'Event Loop', 'Promises', 'Microtasks', 'JS Concurrency'],
    status: 'active',
    conceptChecklist: [
      'call stack and web APIs',
      'task queue vs microtask queue',
      'event loop tick mechanics',
      'Promise lifecycle and chaining',
      'async/await error handling',
      'Promise.all vs Promise.allSettled'
    ],
    videoCount: 4
  },
  {
    id: 'physics_electrostatics',
    subjectId: 'physics',
    parentId: null,
    slug: 'physics-electrostatics',
    name: 'Electrostatics & Electric Fields',
    description: 'Coulomb law, electric flux, Gauss theorem, electric potential, capacitance and dielectric media',
    aliases: ['Electrostatics', 'Coulomb Law', 'Gauss Theorem', 'Capacitance', 'Electric Field', 'Class 12 Physics'],
    status: 'active',
    educationLevel: 'Class 12',
    stream: 'Science',
    domain: 'Electromagnetism',
    subtopics: ['Coulomb Law', 'Electric Field Lines', 'Gauss Law Applications', 'Capacitors in Series and Parallel'],
    conceptChecklist: [
      'Coulombs law of charges',
      'Electric field and superposition',
      'Electric flux and Gauss theorem',
      'Electric potential difference',
      'Parallel plate capacitor capacitance',
      'Energy stored in an electric field'
    ],
    videoCount: 6
  },
  {
    id: 'physics_electromagnetism',
    subjectId: 'physics',
    parentId: null,
    slug: 'physics-electromagnetism',
    name: 'Electromagnetism & Magnetic Effects of Current',
    description: 'Biot-Savart law, Ampere circuital law, Lorentz magnetic force, electromagnetic induction and Faraday law',
    aliases: ['Electromagnetism', 'Biot-Savart Law', 'Magnetic Field', 'Faraday Law', 'EMI', 'Induction'],
    status: 'active',
    educationLevel: 'Class 12',
    stream: 'Science',
    domain: 'Electromagnetism',
    subtopics: ['Magnetic Force on Moving Charges', 'Biot-Savart Law', 'Faraday Induction', 'Lenz Law'],
    conceptChecklist: [
      'Lorentz force equation',
      'Biot-Savart law derivation',
      'Ampere circuital law',
      'Faraday laws of induction',
      'Lenz law and energy conservation',
      'Self and mutual inductance'
    ],
    videoCount: 5
  },
  {
    id: 'chem_organic_reactions',
    subjectId: 'chemistry',
    parentId: null,
    slug: 'organic-chemistry-reaction-mechanisms',
    name: 'Organic Chemistry & Reaction Mechanisms',
    description: 'Nucleophilic substitution (SN1/SN2), elimination (E1/E2), electrophilic addition, aldehydes and ketones',
    aliases: ['Organic Chemistry', 'Reaction Mechanisms', 'SN1 SN2', 'Aldehydes and Ketones', 'Class 12 Chemistry'],
    status: 'active',
    educationLevel: 'Class 12',
    stream: 'Science',
    domain: 'Organic Chemistry',
    subtopics: ['Alkyl Halides (SN1 vs SN2)', 'Alcohols and Phenols', 'Carbonyl Compounds', 'Carboxylic Acids'],
    conceptChecklist: [
      'Carbocation stability and hyperconjugation',
      'SN1 vs SN2 stereochemical outcomes',
      'E1 and E2 elimination pathways (Zaitsev rule)',
      'Nucleophilic addition to carbonyl groups',
      'Aldol condensation and Cannizzaro reaction',
      'Grignard reagent synthesis and reactions'
    ],
    videoCount: 8
  },
  {
    id: 'math_calculus',
    subjectId: 'mathematics',
    parentId: null,
    slug: 'calculus-differential-integral',
    name: 'Calculus: Differential & Integral',
    description: 'Limits, derivatives, chain rule, integration techniques, fundamental theorem of calculus and differential equations',
    aliases: ['Calculus', 'Differentiation', 'Integration', 'Limits', 'Class 12 Math', 'Derivatives'],
    status: 'active',
    educationLevel: 'Class 12',
    stream: 'Science',
    domain: 'Calculus',
    subtopics: ['Limits and Continuity', 'Chain Rule & Product Rule', 'Integration by Parts', 'Definite Integrals'],
    conceptChecklist: [
      'Epsilon-delta limit foundation',
      'Derivatives and tangent slopes',
      'Product, quotient and chain rules',
      'Fundamental theorem of calculus',
      'Integration by parts and substitution',
      'First-order separable differential equations'
    ],
    videoCount: 9
  },
  {
    id: 'med_human_anatomy',
    subjectId: 'medical_sciences',
    parentId: null,
    slug: 'human-anatomy-gross-clinical',
    name: 'Human Anatomy: Gross & Clinical',
    description: 'Systematic anatomical organization, musculoskeletal structure, neurovasculature, and regional clinical dissections',
    aliases: ['Human Anatomy', 'Gross Anatomy', 'Musculoskeletal Anatomy', 'Anatomical Structures', 'Dissection'],
    status: 'active',
    educationLevel: 'Medical Studies',
    stream: 'Medical',
    domain: 'Anatomy',
    subtopics: ['Thorax & Heart Architecture', 'Abdominal Viscera', 'Cranial Nerves', 'Upper and Lower Extremity Arteries'],
    conceptChecklist: [
      'Anatomical directional planes and terminology',
      'Chambers, valves and coronary vasculature of heart',
      'Peritoneal folds and retroperitoneal organs',
      'Brachial plexus root distributions',
      'Twelve cranial nerves clinical pathways'
    ],
    videoCount: 7
  },
  {
    id: 'med_cardiovascular_physiology',
    subjectId: 'medical_sciences',
    parentId: null,
    slug: 'cardiovascular-and-renal-physiology',
    name: 'Cardiovascular & Renal Physiology',
    description: 'Cardiac cycle, cardiac output regulation, hemodynamics, nephron glomerular filtration, and acid-base homeostasis',
    aliases: ['Cardiovascular System', 'Human Physiology', 'Cardiac Cycle', 'Renal Physiology', 'Pathophysiology'],
    status: 'active',
    educationLevel: 'Medical Studies',
    stream: 'Medical',
    domain: 'Physiology',
    subtopics: ['Cardiac Conduction System', 'Starling Law of the Heart', 'Glomerular Filtration Rate', 'Renin-Angiotensin System'],
    conceptChecklist: [
      'SA/AV node action potentials and ECG waves',
      'Frank-Starling law and myocardial contractility',
      'Systemic vascular resistance and arterial pressure',
      'Glomerular filtration barrier and clearance calculations',
      'Countercurrent multiplier system in loops of Henle',
      'Renin-angiotensin-aldosterone regulatory axis'
    ],
    videoCount: 6
  },
  {
    id: 'hist_french_revolution',
    subjectId: 'history',
    parentId: null,
    slug: 'the-french-revolution-and-napoleonic-era',
    name: 'The French Revolution & Napoleonic Era',
    description: 'Causes of 1789, Estates-General, Storming of the Bastille, Reign of Terror, Rise of Napoleon and European geopolitical transformation',
    aliases: ['French Revolution', 'Bastille', 'Reign of Terror', 'Napoleon', 'Modern European History'],
    status: 'active',
    educationLevel: 'General',
    stream: 'Humanities',
    domain: 'Modern World History',
    subtopics: ['Ancien Regime Crisis', 'Declaration of Rights of Man', 'Jacobins and Robespierre', 'Napoleonic Code'],
    conceptChecklist: [
      'Three Estates social and fiscal crisis',
      'Storming of the Bastille and Great Fear of 1789',
      'Declaration of the Rights of Man and Citizen',
      'Civil Constitution of the Clergy',
      'Reign of Terror and Committee of Public Safety',
      'Rise of the Consulate and Napoleonic reforms'
    ],
    videoCount: 5
  }
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid_react_useeffect',
    provider: 'youtube',
    providerVideoId: '0ZJgIjIuY7U', // Web Dev Simplified useEffect hook
    canonicalUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
    title: 'Learn useEffect In 13 Minutes',
    description: 'Learn everything you need to know about useEffect in React. We will cover the dependency array, when effects run, and how to write cleanup functions.',
    thumbnailUrl: 'https://i.ytimg.com/vi/0ZJgIjIuY7U/hqdefault.jpg',
    durationSeconds: 832,
    publishedAt: '2023-01-15T12:00:00Z',
    channelTitle: 'Web Dev Simplified',
    primaryTopicId: 'react_hooks',
    secondaryTopicIds: ['async_javascript'],
    topicCoverage: [
      { conceptId: 'useEffect', conceptName: 'useEffect basics', level: 'demonstrated', confidence: 0.98, evidenceSegmentIds: ['seg_1', 'seg_2'] },
      { conceptId: 'dependency array', conceptName: 'Dependency array triggers', level: 'demonstrated', confidence: 0.95, evidenceSegmentIds: ['seg_3'] },
      { conceptId: 'cleanup function', conceptName: 'Unmounting & Cleanup', level: 'demonstrated', confidence: 0.94, evidenceSegmentIds: ['seg_4'] },
      { conceptId: 'useState', conceptName: 'Syncing with local state', level: 'explained', confidence: 0.88, evidenceSegmentIds: ['seg_1'] }
    ],
    chapters: [
      { title: 'Introduction to useEffect', start: 0, end: 120 },
      { title: 'Effect with no dependencies', start: 120, end: 310 },
      { title: 'The Dependency Array explained', start: 310, end: 540 },
      { title: 'Cleanup functions & Component Unmount', start: 540, end: 832 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 96,
      accuracyEvidence: 94,
      exampleQuality: 98,
      completeness: 88,
      limitations: ['Does not cover async functions inside useEffect directly without internal wrapping'],
      needsHumanReview: false
    },
    ratingAverage: 4.88,
    ratingCount: 42,
    creatorTrust: 0.95,
    reasonCodes: ['Top community-rated explanation', 'Strong practical code examples', 'Clear dependency array demonstration']
  },
  {
    id: 'vid_react_custom_hooks',
    provider: 'youtube',
    providerVideoId: '6ThXsUwLWvc', // Web Dev Simplified Custom Hooks
    canonicalUrl: 'https://www.youtube.com/watch?v=6ThXsUwLWvc',
    title: 'How To Create Custom Hooks in React',
    description: 'Custom hooks allow you to extract component logic into reusable functions. Learn how to build useLocalStorage and useUpdateEffect.',
    thumbnailUrl: 'https://i.ytimg.com/vi/6ThXsUwLWvc/hqdefault.jpg',
    durationSeconds: 980,
    publishedAt: '2023-04-10T14:00:00Z',
    channelTitle: 'Web Dev Simplified',
    primaryTopicId: 'react_hooks',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'custom hooks', conceptName: 'Custom Hook Architecture', level: 'demonstrated', confidence: 0.97, evidenceSegmentIds: ['seg_10'] },
      { conceptId: 'useState', conceptName: 'State encapsulation', level: 'demonstrated', confidence: 0.92, evidenceSegmentIds: ['seg_11'] },
      { conceptId: 'useEffect', conceptName: 'Persistent side-effects', level: 'demonstrated', confidence: 0.90, evidenceSegmentIds: ['seg_12'] }
    ],
    chapters: [
      { title: 'Why build Custom Hooks?', start: 0, end: 150 },
      { title: 'Building useLocalStorage', start: 150, end: 580 },
      { title: 'Building useUpdateEffect', start: 580, end: 980 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 93,
      accuracyEvidence: 92,
      exampleQuality: 96,
      completeness: 85,
      limitations: ['Assumes familiarity with basic useState and useEffect mechanics'],
      needsHumanReview: false
    },
    ratingAverage: 4.82,
    ratingCount: 29,
    creatorTrust: 0.95,
    reasonCodes: ['Highly rated by learners', 'Real-world utility examples', 'Encapsulation best practices']
  },
  {
    id: 'vid_bst_explained',
    provider: 'youtube',
    providerVideoId: 'f5dU3xoE6ms', // freeCodeCamp / William Fiset Data Structures Trees
    canonicalUrl: 'https://www.youtube.com/watch?v=f5dU3xoE6ms',
    title: 'Binary Search Tree - Implementation, Insert, Search, Remove',
    description: 'Comprehensive guide to Binary Search Trees covering node structures, binary search tree invariant property, insert, lookup, and deletion with pointers.',
    thumbnailUrl: 'https://i.ytimg.com/vi/f5dU3xoE6ms/hqdefault.jpg',
    durationSeconds: 1540,
    publishedAt: '2022-09-18T10:00:00Z',
    channelTitle: 'William Fiset / freeCodeCamp',
    primaryTopicId: 'binary_search_trees',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'BST property', conceptName: 'BST Invariant Rule', level: 'demonstrated', confidence: 0.99, evidenceSegmentIds: ['seg_bst_1'] },
      { conceptId: 'search operation', conceptName: 'Recursive & iterative search', level: 'demonstrated', confidence: 0.96, evidenceSegmentIds: ['seg_bst_2'] },
      { conceptId: 'node insertion', conceptName: 'Binary tree insert', level: 'demonstrated', confidence: 0.95, evidenceSegmentIds: ['seg_bst_3'] },
      { conceptId: 'node deletion (three cases)', conceptName: 'Removal with 0, 1, or 2 children', level: 'demonstrated', confidence: 0.97, evidenceSegmentIds: ['seg_bst_4'] },
      { conceptId: 'time complexity (O(log n) vs O(n))', conceptName: 'Complexity & degenerate trees', level: 'explained', confidence: 0.92, evidenceSegmentIds: ['seg_bst_5'] }
    ],
    chapters: [
      { title: 'What is a Binary Search Tree?', start: 0, end: 280 },
      { title: 'BST Insertion Algorithm', start: 280, end: 650 },
      { title: 'Search & Complexity Analysis', start: 650, end: 980 },
      { title: 'Tree Removal & In-order Successor', start: 980, end: 1540 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 97,
      accuracyEvidence: 98,
      exampleQuality: 95,
      completeness: 96,
      limitations: ['Code demonstrated in Java, but easily ported to TypeScript/Python'],
      needsHumanReview: false
    },
    ratingAverage: 4.93,
    ratingCount: 56,
    creatorTrust: 0.98,
    reasonCodes: ['Exceptional pedagogical clarity', 'Rigorous deletion case analysis', 'Top community-rated explanation']
  },
  {
    id: 'vid_event_loop_explained',
    provider: 'youtube',
    providerVideoId: '8aGhZQkoFbQ', // Jake Archibald / Philip Roberts Event Loop
    canonicalUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
    title: 'What the heck is the event loop anyway? | JSConf EU',
    description: 'With a pioneering visual simulator, Philip Roberts explains the JavaScript runtime, call stack, event loop, callback queue, and async execution.',
    thumbnailUrl: 'https://i.ytimg.com/vi/8aGhZQkoFbQ/hqdefault.jpg',
    durationSeconds: 1585,
    publishedAt: '2021-03-01T15:00:00Z',
    channelTitle: 'JSConf',
    primaryTopicId: 'async_javascript',
    secondaryTopicIds: ['react_hooks'],
    topicCoverage: [
      { conceptId: 'call stack and web APIs', conceptName: 'Stack execution mechanics', level: 'demonstrated', confidence: 0.99, evidenceSegmentIds: ['seg_el_1'] },
      { conceptId: 'task queue vs microtask queue', conceptName: 'Task scheduling', level: 'demonstrated', confidence: 0.95, evidenceSegmentIds: ['seg_el_2'] },
      { conceptId: 'event loop tick mechanics', conceptName: 'Browser tick loop', level: 'demonstrated', confidence: 0.98, evidenceSegmentIds: ['seg_el_3'] }
    ],
    chapters: [
      { title: 'JavaScript Single Threaded Nature', start: 0, end: 320 },
      { title: 'The Call Stack in Action', start: 320, end: 650 },
      { title: 'Web APIs and Asynchronous Callbacks', start: 650, end: 1100 },
      { title: 'The Event Loop step-by-step', start: 1100, end: 1585 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 98,
      accuracyEvidence: 96,
      exampleQuality: 99,
      completeness: 92,
      limitations: ['Filmed before modern ES module async top-level await, but foundational model remains 100% accurate'],
      needsHumanReview: false
    },
    ratingAverage: 4.95,
    ratingCount: 88,
    creatorTrust: 0.99,
    reasonCodes: ['Gold-standard visual explanation', 'Top community-rated explanation', 'Pedagogical benchmark']
  },
  {
    id: 'vid_physics_electrostatics_cbse',
    provider: 'youtube',
    providerVideoId: 'TFlV46zY1_w',
    canonicalUrl: 'https://www.youtube.com/watch?v=TFlV46zY1_w',
    title: 'Class 12 Physics: Electrostatics & Coulomb\'s Law in One Shot',
    description: 'Comprehensive Class 12 Physics lecture on electric charges, Coulomb law vector form, superposition principle, electric field lines, and flux.',
    thumbnailUrl: 'https://i.ytimg.com/vi/TFlV46zY1_w/hqdefault.jpg',
    durationSeconds: 2400,
    publishedAt: '2023-06-12T10:00:00Z',
    channelTitle: 'Physics Wallah',
    primaryTopicId: 'physics_electrostatics',
    secondaryTopicIds: ['physics_electromagnetism'],
    topicCoverage: [
      { conceptId: 'Coulombs law of charges', conceptName: 'Coulomb Law and Vector Form', level: 'demonstrated', confidence: 0.98 },
      { conceptId: 'Electric field and superposition', conceptName: 'Electric Field & Superposition', level: 'demonstrated', confidence: 0.96 },
      { conceptId: 'Electric flux and Gauss theorem', conceptName: 'Gauss Law Applications', level: 'demonstrated', confidence: 0.95 }
    ],
    chapters: [
      { title: 'Properties of Electric Charges', start: 0, end: 420 },
      { title: 'Coulomb Law in Vector Form', start: 420, end: 1100 },
      { title: 'Electric Field & Superposition Principle', start: 1100, end: 1800 },
      { title: 'Electric Dipole & Flux Intro', start: 1800, end: 2400 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 96,
      accuracyEvidence: 97,
      exampleQuality: 98,
      completeness: 95,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.92,
    ratingCount: 78,
    creatorTrust: 0.97,
    reasonCodes: ['Class 12 Curriculum Aligned', 'Top rated conceptual clarity']
  },
  {
    id: 'vid_chem_organic_reactions_mastery',
    provider: 'youtube',
    providerVideoId: 'V_Xf6pM8rA0',
    canonicalUrl: 'https://www.youtube.com/watch?v=V_Xf6pM8rA0',
    title: 'Complete Organic Chemistry Reaction Mechanisms: SN1, SN2, E1, E2',
    description: 'Master nucleophilic substitution and elimination reactions. Detailed electron arrow pushing, stereochemistry inversion, carbocation rearrangement, and Zaitsev rule.',
    thumbnailUrl: 'https://i.ytimg.com/vi/V_Xf6pM8rA0/hqdefault.jpg',
    durationSeconds: 1980,
    publishedAt: '2023-05-18T14:00:00Z',
    channelTitle: 'The Organic Chemistry Tutor',
    primaryTopicId: 'chem_organic_reactions',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'SN1 vs SN2 stereochemical outcomes', conceptName: 'SN1 vs SN2 Mechanisms', level: 'demonstrated', confidence: 0.99 },
      { conceptId: 'E1 and E2 elimination pathways (Zaitsev rule)', conceptName: 'Elimination Pathways', level: 'demonstrated', confidence: 0.97 },
      { conceptId: 'Carbocation stability and hyperconjugation', conceptName: 'Carbocation Rearrangements', level: 'demonstrated', confidence: 0.96 }
    ],
    chapters: [
      { title: 'SN2 Mechanism & Walden Inversion', start: 0, end: 540 },
      { title: 'SN1 Mechanism & Carbocations', start: 540, end: 1080 },
      { title: 'E2 vs E1 Elimination & Zaitsev Rule', start: 1080, end: 1560 },
      { title: 'Comprehensive Decision Chart', start: 1560, end: 1980 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 98,
      accuracyEvidence: 99,
      exampleQuality: 99,
      completeness: 97,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.96,
    ratingCount: 124,
    creatorTrust: 0.99,
    reasonCodes: ['Gold-standard reaction mechanisms', 'High pedagogical consensus']
  },
  {
    id: 'vid_math_calculus_essence',
    provider: 'youtube',
    providerVideoId: 'WUvTyaaNkzM',
    canonicalUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    title: 'Essence of Calculus: The Fundamental Theorem',
    description: 'Grant Sanderson geometric visualization of calculus, integrals as accumulation, derivatives as rates of change, and the beautiful duality between them.',
    thumbnailUrl: 'https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg',
    durationSeconds: 1020,
    publishedAt: '2022-04-10T12:00:00Z',
    channelTitle: '3Blue1Brown',
    primaryTopicId: 'math_calculus',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'Fundamental theorem of calculus', conceptName: 'Fundamental Theorem of Calculus', level: 'demonstrated', confidence: 0.99 },
      { conceptId: 'Derivatives and tangent slopes', conceptName: 'Geometric Rate of Change', level: 'demonstrated', confidence: 0.98 },
      { conceptId: 'Integration by parts and substitution', conceptName: 'Accumulation Functions', level: 'demonstrated', confidence: 0.96 }
    ],
    chapters: [
      { title: 'The core paradox of calculus', start: 0, end: 210 },
      { title: 'Area under curves as accumulation', start: 210, end: 560 },
      { title: 'Why derivative is the inverse of integral', start: 560, end: 1020 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 99,
      accuracyEvidence: 99,
      exampleQuality: 99,
      completeness: 98,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.98,
    ratingCount: 180,
    creatorTrust: 0.99,
    reasonCodes: ['World-class visual intuition', 'Essential foundational mathematics']
  },
  {
    id: 'vid_med_cardio_anatomy',
    provider: 'youtube',
    providerVideoId: 'q0s-1MC1hcE',
    canonicalUrl: 'https://www.youtube.com/watch?v=q0s-1MC1hcE',
    title: 'Cardiovascular System: Anatomy, Heart Chambers & Blood Flow',
    description: 'Medical lecture on internal heart anatomy, atria, ventricles, atrioventricular valves, semilunar valves, systemic vs pulmonary circuits, and coronary circulation.',
    thumbnailUrl: 'https://i.ytimg.com/vi/q0s-1MC1hcE/hqdefault.jpg',
    durationSeconds: 1320,
    publishedAt: '2023-01-20T08:00:00Z',
    channelTitle: 'Ninja Nerd',
    primaryTopicId: 'med_cardiovascular_physiology',
    secondaryTopicIds: ['med_human_anatomy'],
    topicCoverage: [
      { conceptId: 'Chambers, valves and coronary vasculature of heart', conceptName: 'Heart Chambers & Valves', level: 'demonstrated', confidence: 0.99 },
      { conceptId: 'SA/AV node action potentials and ECG waves', conceptName: 'Conduction System', level: 'demonstrated', confidence: 0.96 }
    ],
    chapters: [
      { title: 'Heart Orientation & Pericardium', start: 0, end: 240 },
      { title: 'Right vs Left Heart Chambers', start: 240, end: 720 },
      { title: 'Valvular Mechanics (Tricuspid, Bicuspid, Aortic)', start: 720, end: 1020 },
      { title: 'Pulmonary & Systemic Circulation Pathway', start: 1020, end: 1320 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 98,
      accuracyEvidence: 99,
      exampleQuality: 98,
      completeness: 96,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.95,
    ratingCount: 110,
    creatorTrust: 0.98,
    reasonCodes: ['High-yield medical school lecture', 'Clinical anatomical precision']
  },
  {
    id: 'vid_hist_french_revolution_crash',
    provider: 'youtube',
    providerVideoId: 'lTTvKwCylFY',
    canonicalUrl: 'https://www.youtube.com/watch?v=lTTvKwCylFY',
    title: 'The French Revolution: Crash Course World History #29',
    description: 'John Green explores the French Revolution, the Three Estates, the Declaration of the Rights of Man, the Reign of Terror, and its lasting global legacy.',
    thumbnailUrl: 'https://i.ytimg.com/vi/lTTvKwCylFY/hqdefault.jpg',
    durationSeconds: 710,
    publishedAt: '2022-02-14T16:00:00Z',
    channelTitle: 'CrashCourse',
    primaryTopicId: 'hist_french_revolution',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'Three Estates social and fiscal crisis', conceptName: 'The Three Estates System', level: 'demonstrated', confidence: 0.98 },
      { conceptId: 'Storming of the Bastille and Great Fear of 1789', conceptName: 'Bastille and 1789 Revolts', level: 'demonstrated', confidence: 0.97 },
      { conceptId: 'Declaration of the Rights of Man and Citizen', conceptName: 'Declaration of Rights', level: 'demonstrated', confidence: 0.96 }
    ],
    chapters: [
      { title: 'Introduction & Causes of the Revolution', start: 0, end: 160 },
      { title: 'The Estates-General & Tennis Court Oath', start: 160, end: 340 },
      { title: 'The Declaration of the Rights of Man', start: 340, end: 510 },
      { title: 'The Reign of Terror & Historical Verdict', start: 510, end: 710 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 97,
      accuracyEvidence: 96,
      exampleQuality: 95,
      completeness: 92,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.89,
    ratingCount: 92,
    creatorTrust: 0.96,
    reasonCodes: ['Engaging historical narrative', 'High secondary curriculum relevance']
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_react_mastery',
    ownerId: 'platform_curator',
    type: 'AI',
    topicId: 'react_hooks',
    title: 'React Hooks: From Fundamentals to Custom Hooks',
    description: 'An AI-curated sequence with minimal conceptual redundancy. Begins with side-effect synchronization, then elevates to modular custom hook architectures.',
    visibility: 'public',
    items: [
      {
        id: 'item_1',
        videoId: 'vid_react_useeffect',
        position: 0,
        purpose: 'Foundational side effect management and cleanup functions',
        coveredConcepts: ['useEffect', 'dependency array', 'cleanup function']
      },
      {
        id: 'item_2',
        videoId: 'vid_react_custom_hooks',
        position: 1,
        purpose: 'Abstracting reusable state and effects into composable custom hooks',
        coveredConcepts: ['custom hooks', 'useState encapsulation']
      }
    ],
    coveredConcepts: ['useEffect', 'dependency array', 'cleanup function', 'custom hooks'],
    missingConcepts: ['useMemo', 'useCallback'],
    estimatedTotalMinutes: 30,
    ratingAverage: 4.89,
    ratingCount: 34,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-10-12T14:00:00Z'
  },
  {
    id: 'pl_dsa_trees',
    ownerId: 'platform_curator',
    type: 'AI',
    topicId: 'binary_search_trees',
    title: 'Binary Search Trees: Structure, Algorithms & Complexity',
    description: 'Master binary search tree properties, pointers, iterative search, recursive insertion, and edge-case deletion.',
    visibility: 'public',
    items: [
      {
        id: 'item_dsa_1',
        videoId: 'vid_bst_explained',
        position: 0,
        purpose: 'Complete end-to-end BST theory and pointer implementation',
        coveredConcepts: ['BST property', 'search operation', 'node insertion', 'node deletion (three cases)', 'time complexity']
      }
    ],
    coveredConcepts: ['BST property', 'search operation', 'node insertion', 'node deletion (three cases)', 'time complexity'],
    missingConcepts: ['AVL Trees rotation balance', 'Red-Black tree coloring'],
    estimatedTotalMinutes: 26,
    ratingAverage: 4.92,
    ratingCount: 19,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z'
  }
];

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'f_notes',
    ownerId: 'current_user',
    name: 'My Personal Notes',
    kind: 'my_notes',
    color: '#3b82f6',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'f_ai',
    ownerId: 'current_user',
    name: 'AI Study Notes',
    kind: 'ai_notes',
    color: '#8b5cf6',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'f_code',
    ownerId: 'current_user',
    name: 'Code Snippets & Practice',
    kind: 'code_snippets',
    color: '#10b981',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'f_playlists',
    ownerId: 'current_user',
    name: 'Saved Learning Paths',
    kind: 'saved_playlists',
    color: '#f59e0b',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z'
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_demo_1',
    ownerId: 'current_user',
    folderId: 'f_notes',
    source: {
      type: 'video',
      videoId: 'vid_react_useeffect',
      timestampSeconds: 310
    },
    type: 'PERSONAL',
    title: 'Key Rule: Dependency Array Equality Check',
    topicIds: ['react_hooks'],
    content: {
      text: 'React uses Object.is comparison for dependency array elements. If passing objects or functions, wrap them in useMemo or useCallback, otherwise the effect re-runs every render.'
    },
    tags: ['react', 'performance', 'gotcha'],
    createdAt: '2026-10-20T14:30:00Z',
    updatedAt: '2026-10-20T14:35:00Z'
  },
  {
    id: 'note_demo_ai_1',
    ownerId: 'current_user',
    folderId: 'f_ai',
    source: {
      type: 'video',
      videoId: 'vid_react_useeffect',
      timestampSeconds: 540
    },
    type: 'AI_GENERATED',
    title: 'AI Structured Notes: useEffect Lifecycle & Cleanup',
    topicIds: ['react_hooks'],
    content: {
      sections: [
        {
          heading: '1. Why Effects Need Cleanups',
          body: 'When setting up subscriptions, event listeners, or timers, leaving them active causes memory leaks and stale closure calls.',
          timestampSeconds: 550,
          sourceSegmentIds: ['seg_4']
        },
        {
          heading: '2. Cleanup Execution Order',
          body: 'The cleanup function executes before the component re-runs the effect with new dependencies, as well as on component unmount.',
          timestampSeconds: 615,
          sourceSegmentIds: ['seg_4']
        },
        {
          heading: '3. Canonical Code Example',
          body: 'Correct pattern for window resize listener cleanup:',
          codeSnippet: `useEffect(() => {\n  const handleResize = () => setWidth(window.innerWidth);\n  window.addEventListener('resize', handleResize);\n  return () => window.removeEventListener('resize', handleResize);\n}, []);`
        }
      ]
    },
    tags: ['ai-notes', 'useEffect', 'lifecycle'],
    createdAt: '2026-10-22T08:15:00Z',
    updatedAt: '2026-10-22T08:15:00Z'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'current_user',
  email: 'learner@finetube.internal',
  displayName: 'Alex Learner',
  role: 'learner',
  bio: 'Lifelong learner building deep conceptual foundations across sciences, technology, and mathematics.',
  learningGoal: 'Master core principles and explore interdisciplinary connections.',
  educationLevel: 'Undergraduate',
  stream: 'Science',
  followedSubjectIds: ['physics', 'chemistry', 'mathematics', 'cs_it'],
  followedTopicIds: ['physics_electrostatics', 'chem_organic_reactions', 'math_calculus', 'react_hooks'],
  mutedTopicIds: [],
  customInterests: ['Quantum Mechanics', 'Organic Synthesis', 'Calculus'],
  workspaceMode: 'auto',
  preferredLanguage: 'javascript',
  dailyGoalMinutes: 30,
  strictFocusMode: true
};
