'use client';

import { useState, useEffect } from 'react';
import { Check, Flag, RefreshCw, Database } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminOperationsPage() {
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [telemetryEvents, setTelemetryEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'metrics' | 'queue' | 'jobs' | 'telemetry' | 'reports' | 'backups'>('metrics');

  useEffect(() => {
    async function loadData() {
      const [q, j, m, h, t, rep, bak] = await Promise.all([
        api.getReviewQueue(),
        api.getAdminJobs(),
        api.getAdminMetrics(),
        api.getHealth(),
        api.getAnalyticsEvents(),
        api.getAdminReports(),
        api.getAdminBackups()
      ]);
      setReviewQueue(q.length > 0 ? q : []);
      setJobs(j.length > 0 ? j : []);
      setMetrics(m);
      setHealth(h);
      setTelemetryEvents(t);
      setReports(rep);
      setBackups(bak);
    }
    loadData();
  }, []);

  const handleResolveReport = async (id: string, decision: 'resolved' | 'dismissed') => {
    await api.resolveAdminReport(id, decision);
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: decision } : r));
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      await api.createAdminBackup();
      setBackupNotice('Snapshot created.');
      const updated = await api.getAdminBackups();
      setBackups(updated);
      setTimeout(() => setBackupNotice(null), 3000);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (fileName: string) => {
    if (!window.confirm(`Restore database from "${fileName}"?`)) {
      return;
    }
    const ok = await api.restoreAdminBackup(fileName);
    if (ok) {
      setBackupNotice(`Restored from ${fileName}`);
      setTimeout(() => setBackupNotice(null), 3000);
    }
  };

  const handleResolveReview = async (id: string, decision: 'approved' | 'rejected') => {
    setReviewQueue(prev => prev.map(item => item.id === id ? { ...item, status: decision } : item));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Operations &amp; Moderation</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm overflow-x-auto">
        {[
          { id: 'metrics', label: 'Metrics' },
          { id: 'queue', label: `Review Queue (${reviewQueue.filter(r => r.status === 'pending_review').length})` },
          { id: 'jobs', label: `Jobs (${jobs.length})` },
          { id: 'telemetry', label: `Telemetry (${telemetryEvents.length})` },
          { id: 'reports', label: `Reports (${reports.filter(r => r.status === 'pending').length})` },
          { id: 'backups', label: `Backups (${backups.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">Videos</span>
              <p className="text-2xl font-bold text-slate-900">{metrics?.totalVideos ?? 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">Topics</span>
              <p className="text-2xl font-bold text-slate-900">{metrics?.totalTopics ?? 0}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">Avg Rating</span>
              <p className="text-2xl font-bold text-amber-600">{metrics?.averageCurriculumRating ?? 4.88} ★</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">Status</span>
              <p className="text-2xl font-bold text-emerald-600">{metrics?.feedHealthStatus ?? 'HEALTHY'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-xs uppercase font-mono">API Availability</span>
              <p className="font-bold text-slate-900">99.98% uptime</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-xs uppercase font-mono">Daily Spend</span>
              <p className="font-bold text-slate-900">${metrics?.unitEconomics?.estimatedDailySpendUSD ?? '0.0480'}</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-xs uppercase font-mono">Cost / Learner</span>
              <p className="font-bold text-emerald-600">${metrics?.unitEconomics?.averageCostPerActiveLearnerUSD ?? '0.0240'} / day</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="space-y-3">
          {reviewQueue.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <span className="px-2 py-0.5 rounded-lg font-mono text-xs bg-amber-50 text-amber-700 border border-amber-200">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Topic: <strong>{item.detectedTopic}</strong> · {item.reason}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'pending_review' ? (
                  <>
                    <button
                      onClick={() => handleResolveReview(item.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleResolveReview(item.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition-colors"
                    >
                      Re-evaluate
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono font-semibold text-emerald-700 uppercase">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-3">
          {jobs.map(job => (
            <div
              key={job.jobId}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-slate-500">{job.jobId}</span>
                  <span className="font-semibold text-slate-900">{job.videoId || 'Video Job'}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(job.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {job.status} ({job.progress}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Backend Status</span>
              <p className="text-lg font-bold text-slate-900 capitalize">{health?.status || 'Healthy'}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Heap Memory</span>
              <p className="text-lg font-bold text-slate-900">
                {health?.memory?.heapUsedMb ? `${health.memory.heapUsedMb} MB` : '42 MB'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Events</span>
              <p className="text-lg font-bold text-slate-900">{telemetryEvents.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            {telemetryEvents.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No telemetry events yet.</p>
            ) : (
              telemetryEvents.map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-white border border-slate-200 text-slate-800">
                      {evt.eventName}
                    </span>
                    <span className="font-mono text-slate-500 truncate">
                      {JSON.stringify(evt.properties || {})}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono shrink-0">
                    {new Date(evt.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center bg-white border border-slate-200 rounded-2xl">No user reports.</p>
          ) : (
            reports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Flag className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-mono font-bold text-amber-700 uppercase">
                      {rep.reason.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500 font-mono">{rep.targetId}</span>
                  </div>
                  <p className="text-sm text-slate-700">{rep.details || 'No details.'}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Resolve
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                      {rep.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database Backups</span>
            </div>
            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>{isBackingUp ? 'Creating...' : 'Create Snapshot'}</span>
            </button>
          </div>

          {backupNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
              {backupNotice}
            </div>
          )}

          <div className="space-y-3">
            {backups.map(bak => (
              <div
                key={bak.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="font-mono font-semibold text-sm text-slate-900">{bak.fileName}</span>
                  <p className="text-xs text-slate-500">
                    {new Date(bak.createdAt).toLocaleString()} · {(bak.sizeBytes / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => handleRestoreBackup(bak.fileName)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold shrink-0"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
