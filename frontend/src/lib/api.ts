import { store } from './store';
import { Video, Topic, Playlist, Note } from './types';
import { calculateBayesianRating } from './ranking';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export const api = {
  // Feed
  async getFeed(): Promise<any[]> {
    const remote = await safeFetch<any[]>('/feed');
    if (remote && Array.isArray(remote)) return remote;
    return store.getFocusedFeed().map(item => ({
      video: item.video,
      rankScore: item.rankScore,
      bayesianRating: calculateBayesianRating(item.video.ratingAverage, item.video.ratingCount),
      topic: item.topic
    }));
  },

  // Topics
  async getTopics(): Promise<Topic[]> {
    const remote = await safeFetch<Topic[]>('/topics');
    if (remote && Array.isArray(remote)) return remote;
    return store.getTopics();
  },

  async getTopicBySlug(slug: string): Promise<{ topic: Topic; videos: Video[] } | null> {
    const remote = await safeFetch<{ topic: Topic; videos: Video[] }>(`/topics/${slug}`);
    if (remote) return remote;
    const topic = store.getTopicBySlug(slug);
    if (!topic) return null;
    const videos = store.getVideos(topic.id);
    return { topic, videos };
  },

  // Videos
  async getVideo(id: string): Promise<Video | null> {
    const remote = await safeFetch<Video>(`/videos/${id}`);
    if (remote) return remote;
    return store.getVideoById(id) || null;
  },

  async rateVideo(id: string, score: number): Promise<Video | null> {
    const remote = await safeFetch<Video>(`/videos/${id}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ score })
    });
    if (remote) return remote;
    store.submitRating(id, score);
    return store.getVideoById(id) || null;
  },

  // Playlists
  async getPlaylists(): Promise<Playlist[]> {
    const remote = await safeFetch<Playlist[]>('/playlists');
    if (remote && Array.isArray(remote)) return remote;
    return store.getPlaylists();
  },

  async getPlaylist(id: string): Promise<Playlist | null> {
    const remote = await safeFetch<Playlist>(`/playlists/${id}`);
    if (remote) return remote;
    return store.getPlaylistById(id) || null;
  },

  async reorderPlaylist(id: string, items: any[]): Promise<boolean> {
    const remote = await safeFetch(`/playlists/${id}/items/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ items })
    });
    return !!remote;
  },

  async forkPlaylist(id: string): Promise<Playlist | null> {
    const remote = await safeFetch<Playlist>(`/playlists/${id}/fork`, {
      method: 'POST'
    });
    if (remote) return remote;
    const original = store.getPlaylistById(id);
    if (!original) return null;
    const forked: Playlist = {
      ...original,
      id: `pl_fork_${Date.now()}`,
      type: 'CUSTOMISED',
      title: `${original.title} (Personal Copy)`,
      description: `Personal fork of ${original.title}. Customized for focused study.`
    };
    return forked;
  },

  async ratePlaylist(id: string, ratingData: { rating: number; orderClarity?: number; coversTopic?: string; hasRepetition?: string; feedback?: string }): Promise<any> {
    const remote = await safeFetch(`/playlists/${id}/ratings`, {
      method: 'POST',
      body: JSON.stringify(ratingData)
    });
    return remote;
  },

  async generateAiPlaylist(topicId: string): Promise<Playlist | null> {
    const remote = await safeFetch<Playlist>(`/topics/${topicId}/ai-playlists`, {
      method: 'POST'
    });
    return remote;
  },

  // AI Assistant
  async askGroundedQuestion(videoId: string, question: string): Promise<any> {
    const remote = await safeFetch<any>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ videoId, question })
    });
    return remote;
  },

  async generateStructuredNotes(videoId: string): Promise<any> {
    const remote = await safeFetch<any>('/ai/generate-notes', {
      method: 'POST',
      body: JSON.stringify({ videoId })
    });
    return remote;
  },

  // Ingestion
  async ingestVideo(urlOrId: string, primaryTopicId: string): Promise<{ jobId: string; status: string } | null> {
    const remote = await safeFetch<{ jobId: string; status: string }>('/videos/ingest', {
      method: 'POST',
      body: JSON.stringify({ urlOrId, primaryTopicId })
    });
    return remote;
  },

  async getJobStatus(jobId: string): Promise<any> {
    const remote = await safeFetch<any>(`/jobs/${jobId}`);
    return remote;
  },

  // Admin
  async getReviewQueue(): Promise<any[]> {
    const remote = await safeFetch<any[]>('/admin/review-queue');
    return remote || [];
  },

  async getAdminJobs(): Promise<any[]> {
    const remote = await safeFetch<any[]>('/admin/jobs');
    return remote || [];
  },

  // Developer Sandbox & Execution (Blueprint Section 8.3 & 8.4)
  async executeCode(code: string, language: string = 'javascript', videoId?: string, topicId?: string): Promise<{
    output: string[];
    status: 'SUCCESS' | 'ERROR';
    executionTimeMs: number;
    quotaRemaining: number;
  }> {
    const remote = await safeFetch<any>('/code/execute', {
      method: 'POST',
      body: JSON.stringify({ code, language, videoId, topicId })
    });
    if (remote) return remote;

    // Fallback safe client-side execution if backend is offline
    const startTime = Date.now();
    const logs: string[] = [];
    try {
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        },
        error: (...args: any[]) => {
          logs.push(`Error: ${args.join(' ')}`);
        }
      };
      const runFn = new Function('console', code);
      runFn(customConsole);
      return {
        output: logs.length > 0 ? logs : ['Execution finished. No output.'],
        status: 'SUCCESS',
        executionTimeMs: Math.max(1, Date.now() - startTime),
        quotaRemaining: 48
      };
    } catch (err: any) {
      return {
        output: [`Runtime Error: ${err.message}`],
        status: 'ERROR',
        executionTimeMs: Math.max(1, Date.now() - startTime),
        quotaRemaining: 48
      };
    }
  },

  async saveCodeSnippet(title: string, code: string, language: string, videoId?: string, topicId?: string): Promise<any> {
    const remote = await safeFetch<any>('/workspaces/snippets', {
      method: 'POST',
      body: JSON.stringify({ title, code, language, videoId, topicId })
    });
    if (remote) return remote;

    // Local store fallback
    return store.createNote({
      folderId: 'f_code',
      type: 'PERSONAL',
      title: title || `${language.toUpperCase()} Snippet`,
      topicIds: topicId ? [topicId] : [],
      source: {
        type: 'video',
        videoId
      },
      content: {
        text: code,
        sections: [
          {
            heading: `Code Practice: ${language}`,
            body: 'Saved from interactive workspace.',
            codeSnippet: code
          }
        ]
      },
      tags: ['code-practice', language]
    });
  },

  async getCodeQuota(): Promise<{ dailyQuota: number; remaining: number; usedToday: number }> {
    const remote = await safeFetch<any>('/workspaces/quota');
    if (remote) return remote;
    return { dailyQuota: 50, remaining: 48, usedToday: 2 };
  }
};
