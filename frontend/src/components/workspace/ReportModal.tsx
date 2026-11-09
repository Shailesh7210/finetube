'use client';

import { useState } from 'react';
import { Flag, X, Check, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'video' | 'ai_note' | 'playlist';
  targetId: string;
  targetTitle?: string;
}

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle }: ReportModalProps) {
  const [reason, setReason] = useState<string>('inaccurate_content');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.submitReport({
        targetType,
        targetId,
        reason,
        details
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setDetails('');
        onClose();
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Report Inaccuracy or Concern</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Report Submitted</h4>
            <p className="text-xs text-zinc-400">
              Thank you for keeping <strong>curriculum standards accurate</strong>. Our review queue has received your report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {targetTitle && (
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/80 text-xs text-zinc-300">
                <span className="text-zinc-500 block text-[10px] font-mono uppercase">Target Resource</span>
                <span className="font-semibold text-white truncate block">{targetTitle}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">
                Primary Issue Category
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="inaccurate_content">Inaccurate Concept or Code Explanation</option>
                <option value="outdated">Outdated Syntax or Deprecated APIs</option>
                <option value="misaligned_timestamps">Misaligned Timestamps or Chapters</option>
                <option value="misleading_tags">Misleading Topic Classification</option>
                <option value="spam">Spam, Policy or Copyright Violation</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">
                Details & Timestamps (Optional)
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe where the error occurs (e.g. at 04:15 the instructor explains...)"
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
