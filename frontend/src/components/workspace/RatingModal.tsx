'use client';

import { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
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
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitRating(video.id, score, {
      clarity,
      practicalExamples,
      answeredQuestion,
      accuracyConcerns: false,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Rating Saved</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1 pr-6">
                Rate Video
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{video.title}</p>
            </div>

            <div className="flex flex-col items-center justify-center py-3 bg-slate-50 rounded-xl border border-slate-200">
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
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-600 mt-2 font-mono">
                {score} / 5
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Explanation Clarity</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClarity(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        clarity === lvl ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">Examples &amp; Depth</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPracticalExamples(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        practicalExamples === lvl ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-700">Answered the topic clearly?</span>
                <button
                  type="button"
                  onClick={() => setAnsweredQuestion(!answeredQuestion)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    answeredQuestion
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {answeredQuestion ? 'Yes' : 'No'}
                </button>
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
