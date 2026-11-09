'use client';

import { useState, useEffect } from 'react';
import { Zap, Sparkles, Terminal, BookOpen, Check, Shield } from 'lucide-react';
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
      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-500">
        Loading usage quotas...
      </div>
    );
  }

  const { tier, usage, resetsAt } = data;
  const isPro = tier === 'PRO';

  return (
    <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800 space-y-5">
      {/* Header & Tier Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Daily Usage Quotas & Tier (Blueprint §20 & §21)</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Fair variable-cost compute limits. Resets daily at <strong>{resetsAt}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
            isPro
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
          }`}>
            {tier} Plan
          </span>

          <button
            onClick={handleToggleTier}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isPro
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-sm'
            }`}
          >
            {isUpdating ? 'Updating...' : isPro ? 'Switch to Free Tier' : 'Upgrade to Pro Tier'}
          </button>
        </div>
      </div>

      {/* Usage Progress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ask AI Meter */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Grounded Ask AI
            </span>
            <span className="font-mono text-zinc-300 text-[11px]">
              {usage.aiQueries.used} / {usage.aiQueries.max}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.aiQueries.used / usage.aiQueries.max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block">
            {usage.aiQueries.remaining} queries remaining today
          </span>
        </div>

        {/* AI Notes Meter */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              AI Notes Synthesizer
            </span>
            <span className="font-mono text-zinc-300 text-[11px]">
              {usage.aiNotes.used} / {usage.aiNotes.max}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.aiNotes.used / usage.aiNotes.max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block">
            {usage.aiNotes.remaining} note generations remaining
          </span>
        </div>

        {/* Sandbox Runs Meter */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Code Sandbox Runs
            </span>
            <span className="font-mono text-zinc-300 text-[11px]">
              {usage.sandboxRuns.used} / {usage.sandboxRuns.max}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (usage.sandboxRuns.used / usage.sandboxRuns.max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono block">
            {usage.sandboxRuns.remaining} executions remaining
          </span>
        </div>
      </div>

      {/* Blueprint §21 Core Guarantee Banner */}
      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-400">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong>Platform Integrity Guarantee (Blueprint §21)</strong>: Video discovery, algorithmic Bayesian ranking, personal note-taking, and learning playlists are <strong>unconditionally free and unbiased</strong>. Paid plans never influence video ranking position.
        </p>
      </div>
    </div>
  );
}
