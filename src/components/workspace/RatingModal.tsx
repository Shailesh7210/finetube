'use client';

import { useState } from 'react';
import { Star, X, CheckCircle2, ShieldCheck, ThumbsUp, HelpCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { Video } from '@/lib/types';

interface RatingModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  onRated?: () => void;
}

export function RatingModal({ video, isOpen, onClose, onRated }: RatingModalProps) {
  const [score, setScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [clarity, setClarity] = useState(5);
  const [practicalExamples, setPracticalExamples] = useState(5);
  const [answeredQuestion, setAnsweredQuestion] = useState(true);
  const [accuracyConcerns, setAccuracyConcerns] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitRating(video.id, score, {
      clarity,
      practicalExamples,
      answeredQuestion,
      accuracyConcerns,
      comment: comment.trim() || undefined
    });

    setIsSubmitted(true);
    if (onRated) onRated();
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Feedback Recorded!</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Your feedback feeds directly into the Bayesian confidence scoring model for this topic.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold mb-1 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Evidence & Pedagogy Review
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">
                Rate &quot;{video.title}&quot;
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates how clearly and effectively this video teaches the target concept.
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 mb-2 font-medium">Overall Educational Value</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverScore || score) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-400 mt-2 font-mono">
                {score} / 5 Stars
              </span>
            </div>

            {/* Structured Criteria (Section 5.2) */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Explanation Clarity:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClarity(lvl)}
                      className={`px-2 py-0.5 rounded text-xs ${
                        clarity === lvl ? 'bg-brand-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Practical Code Examples:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPracticalExamples(lvl)}
                      className={`px-2 py-0.5 rounded text-xs ${
                        practicalExamples === lvl ? 'bg-brand-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300">Answered the concept clearly?</span>
                <button
                  type="button"
                  onClick={() => setAnsweredQuestion(!answeredQuestion)}
                  className={`px-3 py-1 rounded text-xs font-medium border ${
                    answeredQuestion 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {answeredQuestion ? 'Yes' : 'No'}
                </button>
              </div>
            </div>

            {/* Comment input */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional feedback: specific strengths, weaknesses or inaccuracies..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Skip / Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-all"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
