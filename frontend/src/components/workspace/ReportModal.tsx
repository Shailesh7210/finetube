'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'video' | 'ai_note' | 'playlist';
  targetId: string;
  targetTitle?: string;
}

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle }: ReportModalProps) {
  const [reason, setReason] = useState<string>('incorrect_categorization');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Report Issue</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">Report Submitted</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {targetTitle && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 truncate font-medium">
                {targetTitle}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-medium text-slate-700 block">Issue</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="incorrect_categorization">Wrong Subject or Topic</option>
                <option value="inaccurate_content">Inaccurate Content</option>
                <option value="wrong_education_level">Wrong Education Level</option>
                <option value="outdated">Outdated Material</option>
                <option value="misaligned_timestamps">Misaligned Chapters</option>
                <option value="spam">Distracting or Spam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-700 block">Details (Optional)</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
