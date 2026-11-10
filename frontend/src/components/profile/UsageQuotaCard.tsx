'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function UsageQuotaCard() {
  const [data, setData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsage = async () => {
    const res = await api.getUserBillingUsage();
    setData(res);
  };

  useEffect(() => {
    loadUsage();
  }, []);

  const handleToggleTier = async () => {
    if (!data) return;
    setIsUpdating(true);
    const newTier = data.tier === 'FREE' ? 'PRO' : 'FREE';
    try {
      await api.updateUserTier(newTier);
      await loadUsage();
    } finally {
      setIsUpdating(false);
    }
  };

  if (!data) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-sm text-slate-500">
        Loading usage quotas...
      </div>
    );
  }

  const { tier, usage, resetsAt } = data;
  const isPro = tier === 'PRO';

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Daily Quotas & Plan</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Resets daily at {resetsAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
            isPro
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {tier} Plan
          </span>

          <button
            onClick={handleToggleTier}
            disabled={isUpdating}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            {isUpdating ? 'Updating...' : isPro ? 'Switch to Free' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Ask AI</span>
            <span className="font-mono text-slate-600">{usage.aiQueries.used} / {usage.aiQueries.max}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.aiQueries.used / usage.aiQueries.max) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">AI Notes</span>
            <span className="font-mono text-slate-600">{usage.aiNotes.used} / {usage.aiNotes.max}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.aiNotes.used / usage.aiNotes.max) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Code Runs</span>
            <span className="font-mono text-slate-600">{usage.sandboxRuns.used} / {usage.sandboxRuns.max}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.sandboxRuns.used / usage.sandboxRuns.max) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
