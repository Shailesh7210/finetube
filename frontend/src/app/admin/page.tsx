'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Check, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminOperationsPage() {
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'jobs'>('queue');

  useEffect(() => {
    async function loadData() {
      const [q, j] = await Promise.all([
        api.getReviewQueue(),
        api.getAdminJobs()
      ]);
      setReviewQueue(q.length > 0 ? q : [
        {
          id: 'rev_sample',
          videoId: 'vid_unconfirmed_sample',
          title: 'Advanced React State Patterns & Concurrent Rendering',
          detectedTopic: 'React Hooks',
          confidence: 0.68,
          reason: 'Low confidence mapping between Concurrent Mode and standard useEffect lifecycle',
          status: 'pending_review'
        }
      ]);
      setJobs(j.length > 0 ? j : [
        {
          jobId: 'job_sample_1',
          videoId: 'vid_0ZJgIjIuY7U',
          status: 'COMPLETED',
          progress: 100,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    }
    loadData();
  }, []);

  const handleResolveReview = async (id: string, decision: 'approved' | 'rejected') => {
    setReviewQueue(prev => prev.map(item => item.id === id ? { ...item, status: decision } : item));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
          <span>Blueprint §16</span>
          <span>•</span>
          <span>Curator & Operations Console</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Content Operations & Review Queue</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Inspect <strong>low-confidence topic classifications</strong>, verify <strong>evidence segment citations</strong>, and monitor <strong>asynchronous ingestion jobs</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'queue'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Review Queue ({reviewQueue.filter(r => r.status === 'pending_review').length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'jobs'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Job Monitor ({jobs.length})
        </button>
      </div>

      {activeTab === 'queue' ? (
        <div className="space-y-3">
          {reviewQueue.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white">{item.title}</span>
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                    item.confidence < 0.75 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    Confidence: <strong>{Math.round(item.confidence * 100)}%</strong>
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Target Topic: <strong className="text-zinc-200">{item.detectedTopic}</strong> • Flag: {item.reason}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'pending_review' ? (
                  <>
                    <button
                      onClick={() => handleResolveReview(item.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 text-xs font-semibold transition-colors"
                    >
                      Confirm Mapping
                    </button>
                    <button
                      onClick={() => handleResolveReview(item.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                    >
                      Re-evaluate
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div
              key={job.jobId}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-zinc-400">{job.jobId}</span>
                  <span className="font-semibold text-white">{job.videoId || 'Video Processing'}</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Created at {new Date(job.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                  job.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                }`}>
                  {job.status} ({job.progress}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
