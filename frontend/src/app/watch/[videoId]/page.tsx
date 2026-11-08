'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Star, Bookmark, Check, Keyboard, X } from 'lucide-react';
import { store } from '@/lib/store';
import { VideoPlayer, VideoPlayerRef } from '@/components/workspace/VideoPlayer';
import { PersonalNotesPanel } from '@/components/workspace/PersonalNotesPanel';
import { AiNotesPanel } from '@/components/workspace/AiNotesPanel';
import { AskAiPanel } from '@/components/workspace/AskAiPanel';
import { CodeEditorSandbox } from '@/components/workspace/CodeEditorSandbox';
import { QuizPanel } from '@/components/workspace/QuizPanel';
import { RatingModal } from '@/components/workspace/RatingModal';
import { formatTimestamp } from '@/lib/utils';
import { calculateBayesianRating } from '@/lib/ranking';

export default function WatchPage() {
  const params = useParams();
  const videoId = params?.videoId as string;
  const playerRef = useRef<VideoPlayerRef>(null);

  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'quiz' | 'ai_notes' | 'ask_ai' | 'chapters'>('notes');
  const [currentTime, setCurrentTime] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === '?') {
        setShowShortcutsModal(prev => !prev);
      } else if (e.key === '1') {
        setActiveTab('notes');
      } else if (e.key === '2') {
        setActiveTab('code');
      } else if (e.key === '3') {
        setActiveTab('quiz');
      } else if (e.key === '4') {
        setActiveTab('ai_notes');
      } else if (e.key === '5') {
        setActiveTab('ask_ai');
      } else if (e.key === '6') {
        setActiveTab('chapters');
      } else if (e.key.toLowerCase() === 'j') {
        if (playerRef.current) playerRef.current.seekTo(Math.max(0, currentTime - 10));
      } else if (e.key.toLowerCase() === 'l') {
        if (playerRef.current) playerRef.current.seekTo(currentTime + 10);
      } else if (e.key.toLowerCase() === 'r') {
        setIsRatingModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime]);

  const video = store.getVideoById(videoId);
  if (!video) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-base font-medium text-white">Video not found</h2>
        <Link href="/" className="text-xs text-blue-400 hover:underline">
          Return to feed
        </Link>
      </div>
    );
  }

  const topic = store.getTopics().find(t => t.id === video.primaryTopicId);
  const bayesianRating = calculateBayesianRating(video.ratingAverage, video.ratingCount);

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  const handleSaveToLibrary = () => {
    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: `Saved: ${video.title}`,
      topicIds: [video.primaryTopicId],
      source: {
        type: 'video',
        videoId: video.id
      },
      content: {
        text: `Saved video reference`
      },
      tags: ['saved']
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPlayer
            ref={playerRef}
            providerVideoId={video.providerVideoId}
            title={video.title}
            onTimeUpdate={(time) => setCurrentTime(time)}
          />

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-zinc-100">
                  {video.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span>{video.channelTitle}</span>
                  {topic && <span>• {topic.name}</span>}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {bayesianRating} ({video.ratingCount})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSaveToLibrary}
                  disabled={isSaved}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Rate
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              {video.description}
            </p>
          </div>
        </div>

        {/* Right: Workspace Tools (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[650px] border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-950">
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-800/80 bg-zinc-900/50">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'quiz'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('ai_notes')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'ai_notes'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              AI Notes
            </button>
            <button
              onClick={() => setActiveTab('ask_ai')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'ask_ai'
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ask AI
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'chapters'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Chapters
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden p-4">
            {activeTab === 'notes' && (
              <PersonalNotesPanel
                videoId={video.id}
                topicId={video.primaryTopicId}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'code' && (
              <CodeEditorSandbox
                videoId={video.id}
                topicId={video.primaryTopicId}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizPanel
                video={video}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'ai_notes' && (
              <AiNotesPanel
                video={video}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'ask_ai' && (
              <AskAiPanel
                video={video}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'chapters' && (
              <div className="space-y-1.5 overflow-y-auto h-full">
                {video.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(chap.start)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-zinc-900 flex items-center justify-between text-xs text-zinc-300 transition-colors"
                  >
                    <span>{chap.title}</span>
                    <span className="font-mono text-zinc-500 text-[11px] shrink-0">
                      {formatTimestamp(chap.start)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Keyboard Shortcuts Trigger */}
      <div className="pt-4 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 mt-6">
        <button
          onClick={() => setShowShortcutsModal(true)}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">?</kbd>
          <span>Accessible Keyboard Shortcuts</span>
        </button>

        <span className="text-[11px] text-zinc-600 font-mono">
          FineTube Focused Workspace v1.0
        </span>
      </div>

      <RatingModal
        video={video}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-100 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-400" />
                <span>Keyboard Shortcuts (Blueprint §9.1)</span>
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Switch to Notes</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">1</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Switch to Code Sandbox</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">2</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Switch to Concept Quiz</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">3</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Switch to AI Notes</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">4</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Switch to Ask AI</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">5</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Seek Backward / Forward 10s</span>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">J</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">L</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Rate Video & Coherence</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px]">R</kbd>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
