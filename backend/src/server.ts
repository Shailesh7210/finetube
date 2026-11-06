import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { calculateTopicScore } from './services/rankingService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory data seed for instantaneous execution without requiring external DB
let topics = [
  {
    id: 'react_hooks',
    subjectId: 'cs_it',
    slug: 'react-hooks',
    name: 'React Hooks',
    description: 'State management, side-effects, memoization and reusable custom hooks in modern React',
    aliases: ['React', 'Hooks', 'useEffect', 'useState'],
    status: 'active',
    conceptChecklist: ['useState', 'useEffect', 'dependency array', 'cleanup function', 'useMemo', 'useCallback', 'custom hooks']
  },
  {
    id: 'binary_search_trees',
    subjectId: 'cs_it',
    slug: 'binary-search-trees',
    name: 'Binary Search Trees (BST)',
    description: 'Tree data structures, BST invariant properties, search, insertion, deletion and tree traversals',
    aliases: ['BST', 'Binary Tree', 'Trees', 'DSA Trees'],
    status: 'active',
    conceptChecklist: ['BST property', 'search operation', 'node insertion', 'node deletion', 'in-order traversal', 'time complexity']
  },
  {
    id: 'system_design',
    subjectId: 'cs_it',
    slug: 'system-design',
    name: 'System Design Fundamentals',
    description: 'Architecting distributed systems, caching, database sharding, load balancing and CAP theorem',
    aliases: ['System Architecture', 'Distributed Systems', 'Scalability'],
    status: 'active',
    conceptChecklist: ['horizontal vs vertical scaling', 'load balancers', 'caching strategies', 'database indexing', 'CAP theorem']
  }
];

let videos = [
  {
    id: 'vid_react_useeffect',
    provider: 'youtube',
    providerVideoId: '0ZJgIjIuY7U',
    canonicalUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
    title: 'Learn useEffect In 13 Minutes',
    description: 'Learn everything you need to know about useEffect in React. We will cover the dependency array, when effects run, and how to write cleanup functions.',
    thumbnailUrl: 'https://i.ytimg.com/vi/0ZJgIjIuY7U/hqdefault.jpg',
    durationSeconds: 832,
    publishedAt: '2023-01-15T12:00:00Z',
    channelTitle: 'Web Dev Simplified',
    primaryTopicId: 'react_hooks',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'useEffect', conceptName: 'useEffect basics', level: 'demonstrated', confidence: 0.98 },
      { conceptId: 'dependency array', conceptName: 'Dependency array triggers', level: 'demonstrated', confidence: 0.95 },
      { conceptId: 'cleanup function', conceptName: 'Unmounting & Cleanup', level: 'demonstrated', confidence: 0.94 }
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
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.88,
    ratingCount: 42,
    creatorTrust: 0.95,
    reasonCodes: ['Top community-rated explanation', 'Strong practical code examples']
  },
  {
    id: 'vid_bst_explained',
    provider: 'youtube',
    providerVideoId: 'f5dU3xoE6ms',
    canonicalUrl: 'https://www.youtube.com/watch?v=f5dU3xoE6ms',
    title: 'Binary Search Tree - Implementation, Insert, Search, Remove',
    description: 'Comprehensive guide to Binary Search Trees covering node structures, binary search tree invariant property, insert, lookup, and deletion with pointers.',
    thumbnailUrl: 'https://i.ytimg.com/vi/f5dU3xoE6ms/hqdefault.jpg',
    durationSeconds: 1540,
    publishedAt: '2022-09-18T10:00:00Z',
    channelTitle: 'freeCodeCamp',
    primaryTopicId: 'binary_search_trees',
    secondaryTopicIds: [],
    topicCoverage: [
      { conceptId: 'BST property', conceptName: 'BST Invariant Rule', level: 'demonstrated', confidence: 0.99 },
      { conceptId: 'search operation', conceptName: 'Recursive & iterative search', level: 'demonstrated', confidence: 0.96 },
      { conceptId: 'node insertion', conceptName: 'Binary tree insert', level: 'demonstrated', confidence: 0.95 }
    ],
    chapters: [
      { title: 'What is a Binary Search Tree?', start: 0, end: 280 },
      { title: 'BST Insertion Algorithm', start: 280, end: 650 },
      { title: 'Search & Complexity Analysis', start: 650, end: 980 }
    ],
    aiAssessment: {
      evaluationVersion: 'v1.4-gpt4o',
      clarity: 97,
      accuracyEvidence: 98,
      exampleQuality: 95,
      completeness: 96,
      limitations: [],
      needsHumanReview: false
    },
    ratingAverage: 4.93,
    ratingCount: 56,
    creatorTrust: 0.98,
    reasonCodes: ['Exceptional pedagogical clarity', 'Top community-rated explanation']
  }
];

let notes: any[] = [];
let userFollowedTopics = ['react_hooks', 'binary_search_trees'];

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'finetube-backend', timestamp: new Date().toISOString() });
});

// Focused Feed (Blueprint Section 5.4 & 12)
app.get('/api/v1/feed', (_req: Request, res: Response) => {
  const feed = videos.map(v => {
    const topic = topics.find(t => t.id === v.primaryTopicId);
    const ranking = calculateTopicScore(v, topic);
    return {
      video: v,
      rankScore: ranking.score,
      bayesianRating: ranking.bayesianRating,
      topic
    };
  }).sort((a, b) => b.rankScore - a.rankScore);

  res.json({ data: feed, meta: { total: feed.length } });
});

// Topics
app.get('/api/v1/topics', (_req: Request, res: Response) => {
  res.json({ data: topics });
});

app.get('/api/v1/topics/:slug', (req: Request, res: Response) => {
  const topic = topics.find(t => t.slug === req.params.slug || t.id === req.params.slug);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const topicVideos = videos.filter(v => v.primaryTopicId === topic.id);
  res.json({ data: { topic, videos: topicVideos } });
});

// Videos
app.get('/api/v1/videos/:id', (req: Request, res: Response) => {
  const video = videos.find(v => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  res.json({ data: video });
});

// Ratings
app.post('/api/v1/videos/:id/ratings', (req: Request, res: Response) => {
  const video = videos.find(v => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });

  const { score } = req.body;
  if (typeof score === 'number' && score >= 1 && score <= 5) {
    const totalScore = video.ratingAverage * video.ratingCount + score;
    video.ratingCount += 1;
    video.ratingAverage = Number((totalScore / video.ratingCount).toFixed(2));
  }
  res.json({ data: video });
});

// Notes
app.get('/api/v1/notes', (_req: Request, res: Response) => {
  res.json({ data: notes });
});

app.post('/api/v1/notes', (req: Request, res: Response) => {
  const newNote = {
    id: `note_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  res.status(201).json({ data: newNote });
});

app.delete('/api/v1/notes/:id', (req: Request, res: Response) => {
  notes = notes.filter(n => n.id !== req.params.id);
  res.json({ success: true });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`FineTube API server running on port ${PORT}`);
  });
});
