'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, BookmarkPlus, Play, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { store } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';
import { Video } from '@/lib/types';

interface QuizPanelProps {
  video: Video;
  onSeek: (seconds: number) => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citationTimestamp: number;
}

interface QuizData {
  videoId: string;
  title: string;
  questions: Question[];
}

export function QuizPanel({ video, onSeek }: QuizPanelProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const data = await api.fetchConceptQuiz(video.id);
      if (data) setQuiz(data);
    }
    loadQuiz();
  }, [video.id]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-zinc-500">
        Loading concept assessment...
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === currentQ.correctIndex;

  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = quiz.questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  const isCompleted = totalAnswered === quiz.questions.length;

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return; // prevent altering after choice
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: index }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSaved(false);
  };

  const handleSaveResult = () => {
    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: `Assessment Score: ${quiz.title} (${totalCorrect}/${quiz.questions.length})`,
      topicIds: [video.primaryTopicId],
      source: {
        type: 'video',
        videoId: video.id
      },
      content: {
        text: `Completed concept assessment for "${video.title}". Score: ${totalCorrect}/${quiz.questions.length} (${Math.round((totalCorrect / quiz.questions.length) * 100)}%).`
      },
      tags: ['assessment', 'quiz-result']
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-semibold">Blueprint §13.0 Assessment</span>
          <h3 className="text-sm font-bold text-white mt-0.5">{quiz.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">
            <strong>{currentIndex + 1}</strong> / {quiz.questions.length}
          </span>
          <button
            onClick={handleReset}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Reset Quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[11px] font-mono font-bold text-zinc-500">Question {currentIndex + 1}</span>
          <p className="text-xs sm:text-sm font-semibold text-zinc-100 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            let optionStyles = 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80';

            if (hasAnswered) {
              if (idx === currentQ.correctIndex) {
                optionStyles = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold';
              } else if (idx === selectedOption) {
                optionStyles = 'bg-rose-500/10 border-rose-500/40 text-rose-300 line-through';
              } else {
                optionStyles = 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start justify-between gap-3 ${optionStyles}`}
              >
                <span>{opt}</span>
                {hasAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Evidenced Explanation Banner (Revealed on Answer) */}
        {hasAnswered && (
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? '✓ Correct Answer' : '✕ Concept Explanation'}
              </span>

              {/* Timestamp Citation Seek */}
              <button
                onClick={() => onSeek(currentQ.citationTimestamp)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                title="Jump to video timestamp"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Review at {formatTimestamp(currentQ.citationTimestamp)}</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
        >
          Previous
        </button>

        {isCompleted ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveResult}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved to Library' : 'Save Score'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={currentIndex === quiz.questions.length - 1 || !hasAnswered}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-white text-zinc-950 font-bold hover:bg-zinc-200 disabled:opacity-30 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
