import {
  INITIAL_TOPICS,
  INITIAL_VIDEOS,
  INITIAL_PLAYLISTS,
  INITIAL_FOLDERS,
  INITIAL_NOTES,
  INITIAL_USER_PROFILE,
  INITIAL_SUBJECTS
} from '../data/mockData';
import {
  Topic,
  Video,
  Playlist,
  Folder,
  Note,
  UserProfile,
  VideoRating,
  Subject
} from '../types';
import { calculateBayesianRating, calculateTopicScore } from '../ranking';

// In-memory persistent state holder for seamless runtime execution
class StoreState {
  subjects: Subject[] = [...INITIAL_SUBJECTS];
  topics: Topic[] = [...INITIAL_TOPICS];
  videos: Video[] = [...INITIAL_VIDEOS];
  playlists: Playlist[] = [...INITIAL_PLAYLISTS];
  folders: Folder[] = [...INITIAL_FOLDERS];
  notes: Note[] = [...INITIAL_NOTES];
  user: UserProfile = { ...INITIAL_USER_PROFILE };
  currentUser: UserProfile | null = null;
  ratings: VideoRating[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('finetube_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.currentUser = parsed;
          this.user = parsed;
        }
      } catch (e) {
        // local storage not available or invalid
      }
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  login(email: string): UserProfile {
    const loggedUser: UserProfile = {
      ...this.user,
      email: email.trim(),
      displayName: email.split('@')[0] || 'Learner'
    };
    this.currentUser = loggedUser;
    this.user = loggedUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem('finetube_user', JSON.stringify(loggedUser));
    }
    return loggedUser;
  }

  signup(name: string, email: string, goal?: string): UserProfile {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: email.trim(),
      displayName: name.trim() || email.split('@')[0],
      role: 'learner',
      bio: '',
      learningGoal: goal || 'Deep conceptual mastery',
      followedTopicIds: ['react_hooks'],
      mutedTopicIds: [],
      preferredLanguage: 'javascript',
      dailyGoalMinutes: 30,
      strictFocusMode: true
    };
    this.currentUser = newUser;
    this.user = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem('finetube_user', JSON.stringify(newUser));
    }
    return newUser;
  }

  logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finetube_user');
    }
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const base = this.currentUser || this.user;
    const updated: UserProfile = {
      ...base,
      ...updates
    };
    this.currentUser = updated;
    this.user = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem('finetube_user', JSON.stringify(updated));
    }
    return updated;
  }

  // Topics
  getTopics(): Topic[] {
    return this.topics;
  }

  getTopicBySlug(slug: string): Topic | undefined {
    return this.topics.find(t => t.slug === slug || t.id === slug);
  }

  // Videos
  getVideos(topicId?: string): Video[] {
    if (!topicId) return this.videos;
    return this.videos.filter(v => 
      v.primaryTopicId === topicId || v.secondaryTopicIds.includes(topicId)
    );
  }

  getVideoById(id: string): Video | undefined {
    return this.videos.find(v => v.id === id);
  }

  // Feed: Blueprint Section 5.5 - Focused feed based on explicit followed topics
  getFocusedFeed(): { video: Video; rankScore: number; reasonCodes: string[]; topic?: Topic }[] {
    const followedSet = new Set(this.user.followedTopicIds);
    const mutedSet = new Set(this.user.mutedTopicIds);

    const candidates = this.videos.filter(v => 
      !mutedSet.has(v.primaryTopicId) &&
      (followedSet.size === 0 || followedSet.has(v.primaryTopicId) || v.secondaryTopicIds.some(st => followedSet.has(st)))
    );

    return candidates.map(v => {
      const topic = this.topics.find(t => t.id === v.primaryTopicId);
      const ranking = calculateTopicScore(v, topic);
      return {
        video: v,
        rankScore: ranking.score,
        reasonCodes: ranking.reasonCodes,
        topic
      };
    }).sort((a, b) => b.rankScore - a.rankScore);
  }

  // User Interests
  toggleFollowTopic(topicId: string): boolean {
    const idx = this.user.followedTopicIds.indexOf(topicId);
    if (idx >= 0) {
      this.user.followedTopicIds.splice(idx, 1);
      return false;
    } else {
      this.user.followedTopicIds.push(topicId);
      // Remove from muted if followed
      this.user.mutedTopicIds = this.user.mutedTopicIds.filter(id => id !== topicId);
      return true;
    }
  }

  toggleMuteTopic(topicId: string): boolean {
    const idx = this.user.mutedTopicIds.indexOf(topicId);
    if (idx >= 0) {
      this.user.mutedTopicIds.splice(idx, 1);
      return false;
    } else {
      this.user.mutedTopicIds.push(topicId);
      this.user.followedTopicIds = this.user.followedTopicIds.filter(id => id !== topicId);
      return true;
    }
  }

  // Ratings: Blueprint Section 5.2 & 5.3
  submitRating(videoId: string, score: number, feedback?: VideoRating['feedback']): VideoRating {
    // Check if user already rated this target
    let rating = this.ratings.find(r => r.userId === this.user.id && r.videoId === videoId);
    const now = new Date().toISOString();

    if (rating) {
      rating.score = score;
      rating.feedback = feedback;
      rating.updatedAt = now;
    } else {
      rating = {
        id: `rating_${Date.now()}`,
        userId: this.user.id,
        videoId,
        score,
        feedback,
        createdAt: now,
        updatedAt: now
      };
      this.ratings.push(rating);
    }

    // Update video rating average and count
    const videoRatings = this.ratings.filter(r => r.videoId === videoId);
    const video = this.getVideoById(videoId);
    if (video) {
      const sum = videoRatings.reduce((acc, curr) => acc + curr.score, 0);
      video.ratingCount = videoRatings.length;
      video.ratingAverage = Number((sum / videoRatings.length).toFixed(2));
    }

    return rating;
  }

  // Notes: Blueprint Section 8.5 & 8.6
  getNotes(folderId?: string): Note[] {
    if (folderId) {
      return this.notes.filter(n => n.folderId === folderId);
    }
    return this.notes;
  }

  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>): Note {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ownerId: this.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.notes.unshift(newNote);
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.notes[idx] = {
      ...this.notes[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.notes[idx];
  }

  deleteNote(id: string): boolean {
    const initialLen = this.notes.length;
    this.notes = this.notes.filter(n => n.id !== id);
    return this.notes.length < initialLen;
  }

  // Playlists: Blueprint Section 7
  getPlaylists(): Playlist[] {
    return this.playlists;
  }

  getPlaylistById(id: string): Playlist | undefined {
    return this.playlists.find(p => p.id === id);
  }

  createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ratingAverage' | 'ratingCount'>): Playlist {
    const newPlaylist: Playlist = {
      ...playlist,
      id: `pl_${Date.now()}`,
      ownerId: this.user.id,
      ratingAverage: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.playlists.unshift(newPlaylist);
    return newPlaylist;
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { appStore: StoreState };
export const store = globalForStore.appStore || new StoreState();
if (process.env.NODE_ENV !== 'production') globalForStore.appStore = store;
