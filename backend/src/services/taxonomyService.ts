/**
 * FineTube Universal Educational Taxonomy Service
 * Provides an extensible hierarchical taxonomy across all disciplines:
 * Science, Mathematics, Medical Sciences, Computer Science, Humanities,
 * Economics, Psychology, Engineering, Law, Languages, and General Knowledge.
 */

export interface SubjectData {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  parentSubjectId?: string | null;
  streams?: string[];
  status: 'active' | 'provisional' | 'archived';
  order: number;
}

export interface TopicData {
  id: string;
  subjectId: string;
  parentId?: string | null;
  slug: string;
  name: string;
  description: string;
  aliases: string[];
  status: 'active' | 'provisional' | 'archived';
  conceptChecklist: string[];
  educationLevel?: string;
  stream?: string;
  subtopics?: string[];
  domain?: string;
}

export const UNIVERSAL_SUBJECTS: SubjectData[] = [
  {
    id: 'physics',
    slug: 'physics',
    name: 'Physics',
    description: 'Mechanics, electromagnetism, thermodynamics, optics, quantum theory and astrophysics',
    category: 'sciences',
    icon: 'Atom',
    parentSubjectId: null,
    streams: ['School Class 11-12', 'Undergraduate', 'Competitive Exams', 'General'],
    status: 'active',
    order: 1
  },
  {
    id: 'chemistry',
    slug: 'chemistry',
    name: 'Chemistry',
    description: 'Organic reaction mechanisms, physical chemistry, chemical kinetics, and inorganic structures',
    category: 'sciences',
    icon: 'FlaskConical',
    parentSubjectId: null,
    streams: ['School Class 11-12', 'Undergraduate', 'Medical Preparation', 'General'],
    status: 'active',
    order: 2
  },
  {
    id: 'mathematics',
    slug: 'mathematics',
    name: 'Mathematics',
    description: 'Calculus, linear algebra, discrete math, probability, differential equations and trigonometry',
    category: 'mathematics',
    icon: 'Binary',
    parentSubjectId: null,
    streams: ['School Class 11-12', 'Engineering', 'Higher Mathematics', 'General'],
    status: 'active',
    order: 3
  },
  {
    id: 'biology',
    slug: 'biology',
    name: 'Biology & Life Sciences',
    description: 'Cell biology, genetics, molecular biology, evolution, ecology and plant physiology',
    category: 'sciences',
    icon: 'Dna',
    parentSubjectId: null,
    streams: ['School Class 11-12', 'Medical Preparation', 'Undergraduate', 'General'],
    status: 'active',
    order: 4
  },
  {
    id: 'medical_sciences',
    slug: 'medical-sciences',
    name: 'Medical Science & Medicine',
    description: 'Human anatomy, clinical physiology, pathology, pharmacology, histology and cardiology',
    category: 'medical',
    icon: 'Stethoscope',
    parentSubjectId: null,
    streams: ['Medical Studies', 'Clinical Practice', 'Nursing & Allied Health'],
    status: 'active',
    order: 5
  },
  {
    id: 'cs_it',
    slug: 'computer-science',
    name: 'Computer Science & Software',
    description: 'Algorithms, data structures, full-stack development, distributed systems and AI/ML',
    category: 'computer_science',
    icon: 'Terminal',
    parentSubjectId: null,
    streams: ['Professional Developers', 'Undergraduate CS', 'Self-Taught'],
    status: 'active',
    order: 6
  },
  {
    id: 'history',
    slug: 'history',
    name: 'History & Civilizations',
    description: 'World history, ancient civilizations, medieval eras, the French Revolution and modern history',
    category: 'humanities',
    icon: 'Landmark',
    parentSubjectId: null,
    streams: ['School & College', 'Civil Services Preparation', 'General Knowledge'],
    status: 'active',
    order: 7
  },
  {
    id: 'geography',
    slug: 'geography',
    name: 'Geography & Earth Sciences',
    description: 'Physical geography, climate systems, geomorphology, oceanography and cartography',
    category: 'social_sciences',
    icon: 'Globe',
    parentSubjectId: null,
    streams: ['School Class 11-12', 'Civil Services', 'General Knowledge'],
    status: 'active',
    order: 8
  },
  {
    id: 'economics_finance',
    slug: 'economics-and-finance',
    name: 'Economics & Finance',
    description: 'Microeconomics, macroeconomic policy, monetary theory, corporate finance and market dynamics',
    category: 'business',
    icon: 'TrendingUp',
    parentSubjectId: null,
    streams: ['Undergraduate', 'Commerce Class 11-12', 'Professionals'],
    status: 'active',
    order: 9
  },
  {
    id: 'psychology',
    slug: 'psychology',
    name: 'Psychology & Cognitive Sciences',
    description: 'Cognitive psychology, behavioral neuroscience, developmental stages and clinical disorders',
    category: 'social_sciences',
    icon: 'Brain',
    parentSubjectId: null,
    streams: ['Undergraduate', 'Applied Psychology', 'General Knowledge'],
    status: 'active',
    order: 10
  },
  {
    id: 'law_polity',
    slug: 'law-and-political-science',
    name: 'Law & Political Science',
    description: 'Constitutional law, jurisprudence, international relations, governance and public policy',
    category: 'humanities',
    icon: 'Scale',
    parentSubjectId: null,
    streams: ['Law Students', 'Civil Services', 'General Learners'],
    status: 'active',
    order: 11
  },
  {
    id: 'general_knowledge',
    slug: 'general-knowledge',
    name: 'General Knowledge & Science',
    description: 'Interdisciplinary science, space exploration, world affairs, philosophy and critical thinking',
    category: 'general',
    icon: 'Sparkles',
    parentSubjectId: null,
    streams: ['Lifelong Learners', 'Competitive Exams', 'Curious Explorers'],
    status: 'active',
    order: 12
  }
];

export const UNIVERSAL_TOPICS: TopicData[] = [
  // --- Class 12 & General Physics ---
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
    ]
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
    ]
  },
  {
    id: 'physics_mechanics',
    subjectId: 'physics',
    parentId: null,
    slug: 'physics-mechanics',
    name: 'Classical Mechanics & Dynamics',
    description: 'Newtonian motion, work-energy theorem, momentum conservation, rotational dynamics and gravitation',
    aliases: ['Mechanics', 'Newton Laws', 'Rotational Motion', 'Kinematics', 'Gravitation'],
    status: 'active',
    educationLevel: 'Undergraduate',
    stream: 'Science',
    domain: 'Classical Physics',
    subtopics: ['Newton Laws', 'Conservation of Momentum', 'Moment of Inertia', 'Kepler Laws'],
    conceptChecklist: [
      'Vectors and kinematic equations',
      'Frictional forces and free body diagrams',
      'Work-energy theorem',
      'Torque and angular momentum conservation',
      'Universal gravitation law'
    ]
  },

  // --- Chemistry (Class 12 & Higher) ---
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
    ]
  },
  {
    id: 'chem_kinetics_equilibrium',
    subjectId: 'chemistry',
    parentId: null,
    slug: 'chemical-kinetics-and-equilibrium',
    name: 'Chemical Kinetics & Equilibrium',
    description: 'Rate laws, order of reaction, Arrhenius activation energy, catalysts and Le Chatelier principle',
    aliases: ['Chemical Kinetics', 'Reaction Rates', 'Arrhenius Equation', 'Chemical Equilibrium'],
    status: 'active',
    educationLevel: 'Class 12',
    stream: 'Science',
    domain: 'Physical Chemistry',
    subtopics: ['Rate Laws', 'First-order Kinetics', 'Arrhenius Temperature Dependence', 'Dynamic Equilibrium'],
    conceptChecklist: [
      'Rate law determination from experimental data',
      'Integrated rate equation for first-order reactions',
      'Half-life derivation and radioactive decay',
      'Collision theory and activation energy barrier',
      'Equilibrium constant Kc and Kp',
      'Le Chatelier principle shifts'
    ]
  },

  // --- Mathematics (Calculus, Linear Algebra, Discrete Math) ---
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
    ]
  },
  {
    id: 'math_linear_algebra',
    subjectId: 'mathematics',
    parentId: null,
    slug: 'linear-algebra-vectors-matrices',
    name: 'Linear Algebra: Matrices & Vector Spaces',
    description: 'Vector spaces, matrix transformations, determinants, eigenvalues, eigenvectors and singular value decomposition',
    aliases: ['Linear Algebra', 'Matrices', 'Vectors', 'Eigenvalues', 'Matrix Decomposition'],
    status: 'active',
    educationLevel: 'Undergraduate',
    stream: 'Mathematics',
    domain: 'Algebra',
    subtopics: ['Matrix Multiplication & Inverses', 'Vector Subspaces', 'Eigenvalue Decomposition', 'Orthogonal Projections'],
    conceptChecklist: [
      'Linear combinations and span',
      'Linear independence and basis',
      'Matrix rank and nullity theorem',
      'Determinants and invertibility',
      'Eigenvalues and eigenvector computation',
      'Diagonalization of symmetric matrices'
    ]
  },

  // --- Medical Sciences ---
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
    ]
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
    ]
  },
  {
    id: 'med_pharmacology',
    subjectId: 'medical_sciences',
    parentId: null,
    slug: 'general-pharmacology-mechanisms',
    name: 'Pharmacology: Drug Mechanisms & Kinetics',
    description: 'Pharmacokinetics (ADME), receptor agonists/antagonists, autonomic pharmacology and antimicrobial resistance',
    aliases: ['Pharmacology', 'Drug Action', 'Pharmacokinetics', 'Pharmacodynamics', 'Antibiotics'],
    status: 'active',
    educationLevel: 'Medical Studies',
    stream: 'Medical',
    domain: 'Pharmacology',
    subtopics: ['Dose-Response Relationships', 'Sympathetic vs Parasympathetic Agonists', 'Beta-Blockers', 'Antimicrobial Classes'],
    conceptChecklist: [
      'Volume of distribution and half-life clearance',
      'Agonist, partial agonist and competitive antagonist curves',
      'Adrenergic alpha and beta receptor signal transduction',
      'Cholinergic muscarinic and nicotinic responses',
      'Mechanism of beta-lactam antibiotics'
    ]
  },

  // --- Computer Science & Programming (Preserved & Enhanced) ---
  {
    id: 'react_hooks',
    subjectId: 'cs_it',
    parentId: null,
    slug: 'react-hooks',
    name: 'React Hooks & State Architecture',
    description: 'State management, side-effects, memoization, ref forwarding and custom hooks in modern React',
    aliases: ['React', 'Hooks', 'useEffect', 'useState', 'Custom Hooks', 'React 18'],
    status: 'active',
    educationLevel: 'Professional',
    stream: 'Software Engineering',
    domain: 'Frontend Engineering',
    subtopics: ['useState & useReducer', 'useEffect & Cleanup', 'useMemo & useCallback', 'Custom Hooks'],
    conceptChecklist: [
      'useState',
      'useEffect',
      'dependency array',
      'cleanup function',
      'useMemo',
      'useCallback',
      'useRef',
      'custom hooks'
    ]
  },
  {
    id: 'binary_search_trees',
    subjectId: 'cs_it',
    parentId: null,
    slug: 'binary-search-trees',
    name: 'Binary Search Trees (BST)',
    description: 'Tree data structures, BST invariant properties, search, insertion, deletion and tree traversals',
    aliases: ['BST', 'Binary Tree', 'Trees', 'DSA Trees', 'Data Structures'],
    status: 'active',
    educationLevel: 'Undergraduate',
    stream: 'Computer Science',
    domain: 'Data Structures & Algorithms',
    subtopics: ['BST Invariant Property', 'Tree Traversals (In/Pre/Post)', 'Node Deletion', 'AVL & Balanced Trees'],
    conceptChecklist: [
      'BST property',
      'search operation',
      'node insertion',
      'node deletion',
      'in-order traversal',
      'time complexity'
    ]
  },
  {
    id: 'system_design',
    subjectId: 'cs_it',
    parentId: null,
    slug: 'system-design',
    name: 'System Design Fundamentals',
    description: 'Architecting distributed systems, caching, database sharding, load balancing and CAP theorem',
    aliases: ['System Architecture', 'Distributed Systems', 'Scalability', 'Microservices'],
    status: 'active',
    educationLevel: 'Professional',
    stream: 'Software Engineering',
    domain: 'Distributed Systems',
    subtopics: ['Horizontal Scaling & Load Balancers', 'Caching Layers (Redis/Memcached)', 'Database Sharding & Replication', 'CAP Theorem'],
    conceptChecklist: [
      'horizontal vs vertical scaling',
      'load balancers',
      'caching strategies',
      'database indexing',
      'CAP theorem'
    ]
  },
  {
    id: 'async_javascript',
    subjectId: 'cs_it',
    parentId: null,
    slug: 'async-javascript',
    name: 'Async JavaScript & Event Loop',
    description: 'Deep dive into asynchronous programming, Promises, async/await, call stack and event loop microtasks',
    aliases: ['JavaScript Async', 'Event Loop', 'Promises', 'Microtasks', 'JS Concurrency'],
    status: 'active',
    educationLevel: 'Professional',
    stream: 'Software Engineering',
    domain: 'Language Internals',
    subtopics: ['Call Stack & Web APIs', 'Task Queue vs Microtask Queue', 'Promise Internals', 'Async/Await Execution Flow'],
    conceptChecklist: [
      'call stack and web APIs',
      'task queue vs microtask queue',
      'Promises',
      'async/await',
      'event loop concurrency'
    ]
  },

  // --- History & Humanities ---
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
    ]
  },
  {
    id: 'hist_ancient_civilizations',
    subjectId: 'history',
    parentId: null,
    slug: 'ancient-civilizations-mesopotamia-egypt-indus',
    name: 'Ancient Civilizations: Mesopotamia, Egypt & Indus Valley',
    description: 'Urbanization, agricultural surpluses, cuneiform writing, river valley trade networks, statecraft and monumental architecture',
    aliases: ['Ancient Civilizations', 'Mesopotamia', 'Ancient Egypt', 'Indus Valley', 'Bronze Age'],
    status: 'active',
    educationLevel: 'General',
    stream: 'Humanities',
    domain: 'Ancient World History',
    subtopics: ['Sumerian City-States & Cuneiform', 'Pharaonic Egypt & Old Kingdom', 'Harappan Urban Planning', 'Bronze Metallurgy'],
    conceptChecklist: [
      'Fertile Crescent agricultural transition',
      'Hammurabi legal code and jurisprudence',
      'Nile inundation and state centralization',
      'Indus Valley grid cities and drainage engineering',
      'Long-distance Bronze Age trade circuits'
    ]
  },

  // --- Economics & Finance ---
  {
    id: 'econ_macroeconomics',
    subjectId: 'economics_finance',
    parentId: null,
    slug: 'macroeconomics-inflation-gdp-monetary-policy',
    name: 'Macroeconomics: GDP, Inflation & Monetary Policy',
    description: 'Aggregate demand and supply, fiscal stimulus, central banking interest rate setting, inflation dynamics and Keynesian vs Classical economics',
    aliases: ['Macroeconomics', 'GDP', 'Inflation', 'Monetary Policy', 'Central Banking', 'Fiscal Policy'],
    status: 'active',
    educationLevel: 'Undergraduate',
    stream: 'Economics',
    domain: 'Macroeconomics',
    subtopics: ['National Income Accounting (GDP)', 'Inflation & CPI Indices', 'Central Bank Open Market Operations', 'IS-LM Framework'],
    conceptChecklist: [
      'GDP measurement via expenditure and income approaches',
      'Cost-push vs demand-pull inflation dynamics',
      'Keynesian multiplier mechanism',
      'Central bank reserve requirements and policy rates',
      'Fiscal deficit financing and national debt sustainability'
    ]
  },

  // --- Psychology & Cognitive Science ---
  {
    id: 'psych_cognitive_behavioral',
    subjectId: 'psychology',
    parentId: null,
    slug: 'cognitive-psychology-memory-perception',
    name: 'Cognitive Psychology: Memory & Perception',
    description: 'Sensory perception, working memory models, long-term memory encoding, cognitive biases and decision heuristics',
    aliases: ['Cognitive Psychology', 'Memory Systems', 'Cognitive Biases', 'Working Memory', 'Neuropsychology'],
    status: 'active',
    educationLevel: 'Undergraduate',
    stream: 'Social Sciences',
    domain: 'Cognitive Sciences',
    subtopics: ['Baddeley Working Memory Model', 'Long-term Memory (Episodic vs Semantic)', 'Heuristics and Biases', 'Visual Perception Pathways'],
    conceptChecklist: [
      'Baddeley multi-component working memory model',
      'Encoding specificity principle and retrieval cues',
      'Dual-process theory (System 1 vs System 2 thinking)',
      'Confirmation bias and availability heuristics',
      'Dorsal vs ventral visual processing streams'
    ]
  }
];

// In-memory extensible registry supporting dynamic registration without code changes
class UniversalTaxonomyRegistry {
  private subjects: Map<string, SubjectData> = new Map();
  private topics: Map<string, TopicData> = new Map();

  constructor() {
    UNIVERSAL_SUBJECTS.forEach(sub => this.subjects.set(sub.id, { ...sub }));
    UNIVERSAL_TOPICS.forEach(top => this.topics.set(top.id, { ...top }));
  }

  // Extensible runtime subject registration
  registerSubject(subject: SubjectData): SubjectData {
    this.subjects.set(subject.id, { ...subject });
    return subject;
  }

  // Extensible runtime topic registration
  registerTopic(topic: TopicData): TopicData {
    this.topics.set(topic.id, { ...topic });
    return topic;
  }

  getAllSubjects(): SubjectData[] {
    return Array.from(this.subjects.values()).sort((a, b) => a.order - b.order);
  }

  getSubjectById(id: string): SubjectData | undefined {
    return this.subjects.get(id);
  }

  getAllTopics(): TopicData[] {
    return Array.from(this.topics.values());
  }

  findTopicByIdOrSlug(idOrSlug: string): TopicData | undefined {
    if (this.topics.has(idOrSlug)) {
      return this.topics.get(idOrSlug);
    }
    return Array.from(this.topics.values()).find(
      t => t.slug === idOrSlug || t.aliases.some(a => a.toLowerCase() === idOrSlug.toLowerCase())
    );
  }

  filterTopics(criteria: {
    subjectId?: string;
    educationLevel?: string;
    stream?: string;
    searchQuery?: string;
  }): TopicData[] {
    let result = Array.from(this.topics.values());

    if (criteria.subjectId) {
      result = result.filter(t => t.subjectId === criteria.subjectId);
    }

    if (criteria.educationLevel) {
      const q = criteria.educationLevel.toLowerCase();
      result = result.filter(t => t.educationLevel && t.educationLevel.toLowerCase().includes(q));
    }

    if (criteria.stream) {
      const q = criteria.stream.toLowerCase();
      result = result.filter(t => t.stream && t.stream.toLowerCase().includes(q));
    }

    if (criteria.searchQuery) {
      const q = criteria.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.aliases.some(a => a.toLowerCase().includes(q)) ||
        t.conceptChecklist.some(c => c.toLowerCase().includes(q))
      );
    }

    return result;
  }
}

export const taxonomyRegistry = new UniversalTaxonomyRegistry();
