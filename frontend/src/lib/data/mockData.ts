import { Subject, Topic, Video, Playlist, Folder, Note, UserProfile } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'cs_it',
    name: 'Computer Science & IT',
    description: 'Software engineering, algorithms, web development, architecture and AI',
    icon: 'Terminal'
  },
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Discrete math, calculus, linear algebra, probability and statistics',
    icon: 'Binary'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, biology and scientific computing',
    icon: 'Atom'
  },
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    description: 'Electrical, robotics, systems engineering and hardware design',
    icon: 'Cpu'
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
  bio: 'Software engineer building deep fundamentals in algorithms and frontend architecture.',
  learningGoal: 'Master React internals and data structures',
  followedTopicIds: ['react_hooks', 'binary_search_trees', 'system_design'],
  mutedTopicIds: [],
  preferredLanguage: 'javascript',
  dailyGoalMinutes: 30,
  strictFocusMode: true
};
