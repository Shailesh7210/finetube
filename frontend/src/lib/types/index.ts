export interface Subject {
  id: string;
  slug?: string;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  parentSubjectId?: string | null;
  streams?: string[];
  status?: 'active' | 'provisional' | 'archived';
  order?: number;
}

export interface Topic {
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
  videoCount?: number;
}

export interface TopicCoverageItem {
  conceptId: string;
  conceptName: string;
  level: 'none' | 'mentioned' | 'explained' | 'demonstrated';
  evidenceSegmentIds?: string[];
  confidence: number;
}

export interface TranscriptSegment {
  id: string;
  videoId: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
  speaker?: string;
}

export interface VideoChapter {
  title: string;
  start: number;
  end: number;
}

export interface AiAssessment {
  evaluationVersion: string;
  clarity: number; // 0-100
  accuracyEvidence: number; // 0-100
  exampleQuality: number; // 0-100
  completeness: number; // 0-100
  limitations: string[];
  needsHumanReview: boolean;
}

export interface Video {
  id: string;
  provider: 'youtube';
  providerVideoId: string;
  canonicalUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  durationSeconds: number;
  publishedAt: string;
  channelTitle: string;
  primaryTopicId: string;
  secondaryTopicIds: string[];
  topicCoverage: TopicCoverageItem[];
  chapters: VideoChapter[];
  aiAssessment: AiAssessment;
  // Computed ranking signals
  ratingAverage: number;
  ratingCount: number;
  creatorTrust: number;
  reasonCodes: string[];
}

export interface VideoRating {
  id: string;
  userId: string;
  videoId: string;
  topicId?: string;
  score: number; // 1-5
  feedback?: {
    clarity?: number;
    practicalExamples?: number;
    topicRelevance?: number;
    accuracyConcerns?: boolean;
    answeredQuestion?: boolean;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RatingAggregate {
  targetId: string;
  scope: 'video' | 'topic' | 'playlist';
  count: number;
  sum: number;
  average: number;
  distribution: Record<number, number>;
  updatedAt: string;
}

export interface PlaylistItem {
  id: string;
  videoId: string;
  position: number;
  purpose: string;
  coveredConcepts: string[];
}

export interface Playlist {
  id: string;
  ownerId: string;
  type: 'AI' | 'USER' | 'CUSTOMISED';
  topicId: string;
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  items: PlaylistItem[];
  coveredConcepts: string[];
  missingConcepts: string[];
  estimatedTotalMinutes: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteSection {
  heading: string;
  body: string;
  codeSnippet?: string;
  sourceSegmentIds?: string[];
  timestampSeconds?: number;
}

export interface Note {
  id: string;
  ownerId: string;
  folderId?: string;
  source?: {
    type: 'video' | 'topic' | 'playlist' | 'standalone';
    videoId?: string;
    topicId?: string;
    timestampSeconds?: number;
  };
  type: 'PERSONAL' | 'AI_GENERATED';
  title: string;
  topicIds: string[];
  content: {
    text?: string;
    sections?: NoteSection[];
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  ownerId: string;
  parentId?: string | null;
  name: string;
  kind: 'my_notes' | 'ai_notes' | 'code_snippets' | 'saved_playlists' | 'custom';
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodeWorkspace {
  id: string;
  ownerId: string;
  videoId?: string;
  topicId?: string;
  language: 'javascript' | 'typescript' | 'python';
  code: string;
  output?: string;
  updatedAt: string;
}

export interface UserInterest {
  userId: string;
  topicId: string;
  state: 'following' | 'muted' | 'exploring';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'creator' | 'admin';
  bio?: string;
  learningGoal?: string;
  educationLevel?: string;
  stream?: string;
  followedSubjectIds?: string[];
  followedTopicIds: string[];
  mutedTopicIds: string[];
  customInterests?: string[];
  workspaceMode?: 'auto' | 'notes' | 'math' | 'code';
  preferredLanguage?: 'javascript' | 'typescript' | 'python';
  dailyGoalMinutes?: number;
  strictFocusMode?: boolean;
  avatarUrl?: string;
}
