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
  const [coversTopic, setCoversTopic] = useState('comprehensive');
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
        coversTopic,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Blueprint §7.5</span>
          <h2 className="text-base font-bold text-white mt-0.5">Rate Sequence Quality</h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Rate the <strong>pedagogical progression</strong> of <strong>{playlistTitle}</strong>. Playlist evaluation is scored separately from individual video quality.
          </p>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Feedback Submitted</h3>
            <p className="text-xs text-zinc-400">
              Your evaluation improves <strong>curriculum sequencing</strong> and <strong>gap detection</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Overall Sequence Score
              </label>
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
                      className={`w-5 h-5 ${
                        star <= (hoverRating ?? rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-zinc-300 ml-2">
                  <strong>{hoverRating ?? rating}</strong> / 5
                </span>
              </div>
            </div>

            {/* Order clarity */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Did the learning order make logical sense?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'logical', label: 'Logical' },
                  { id: 'acceptable', label: 'Acceptable' },
                  { id: 'confusing', label: 'Confusing' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOrderClarity(opt.id)}
                    className={`py-1.5 px-2 rounded text-xs border text-center transition-colors ${
                      orderClarity === opt.id
                        ? 'bg-zinc-800 border-zinc-500 text-white font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Repetition */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Did it contain unnecessary conceptual repetition?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Zero Repetition' },
                  { id: 'minimal', label: 'Minimal / Good' },
                  { id: 'redundant', label: 'Too Redundant' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setHasRepetition(opt.id)}
                    className={`py-1.5 px-2 rounded text-xs border text-center transition-colors ${
                      hasRepetition === opt.id
                        ? 'bg-zinc-800 border-zinc-500 text-white font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Optional Notes on Missing Prerequisite Concepts
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Mention any gap between lessons..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-white text-zinc-950 rounded-lg text-xs font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Save Rating'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
