'use client';

import { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

interface PlaylistRatingModalProps {
  isOpen: boolean;
  playlistId: string;
  playlistTitle: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function PlaylistRatingModal({
  isOpen,
  playlistId,
  playlistTitle,
  onClose,
  onSubmitted
}: PlaylistRatingModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [orderClarity, setOrderClarity] = useState('logical');
  const [hasRepetition, setHasRepetition] = useState('none');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.ratePlaylist(playlistId, {
        rating,
        orderClarity: orderClarity === 'logical' ? 5 : orderClarity === 'acceptable' ? 3 : 1,
        coversTopic: 'comprehensive',
        hasRepetition,
        feedback: feedback.trim()
      });
    } catch {
      // safe fallback
    }

    setIsSubmitting(false);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
      if (onSubmitted) onSubmitted();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Rate Learning Path</h2>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{playlistTitle}</p>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Rating Submitted</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Overall Score</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating ?? rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="text-sm font-semibold text-slate-700 ml-2">
                  {hoverRating ?? rating} / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Lesson Order</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'logical', label: 'Logical' },
                  { id: 'acceptable', label: 'Okay' },
                  { id: 'confusing', label: 'Confusing' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOrderClarity(opt.id)}
                    className={`py-2 px-2 rounded-xl text-xs border text-center transition-colors ${
                      orderClarity === opt.id
                        ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Repetition</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'redundant', label: 'Redundant' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHasRepetition(opt.id)}
                    className={`py-2 px-2 rounded-xl text-xs border text-center transition-colors ${
                      hasRepetition === opt.id
                        ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Optional feedback..."
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
