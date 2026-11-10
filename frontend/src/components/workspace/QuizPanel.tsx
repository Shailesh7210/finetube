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
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
        <h3 className="text-sm font-bold text-slate-900">{quiz.title}</h3>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-600">
            <strong>{currentIndex + 1}</strong> / {quiz.questions.length}
          </span>
          <button
            onClick={handleReset}
            className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
            title="Reset Quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-xs font-mono font-semibold text-slate-500">Question {currentIndex + 1}</span>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            let optionStyles = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-slate-50';

            if (hasAnswered) {
              if (idx === currentQ.correctIndex) {
                optionStyles = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
              } else if (idx === selectedOption) {
                optionStyles = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
              } else {
                optionStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`w-full text-left p-3.5 rounded-xl border text-sm leading-relaxed transition-all flex items-start justify-between gap-3 ${optionStyles}`}
              >
                <span>{opt}</span>
                {hasAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? '✓ Correct' : '✕ Explanation'}
              </span>

              <button
                onClick={() => onSeek(currentQ.citationTimestamp)}
                className="inline-flex items-center gap-1 text-xs font-mono text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{formatTimestamp(currentQ.citationTimestamp)}</span>
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors font-medium"
        >
          Previous
        </button>

        {isCompleted ? (
          <button
            onClick={handleSaveResult}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save Score'}</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={currentIndex === quiz.questions.length - 1 || !hasAnswered}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
