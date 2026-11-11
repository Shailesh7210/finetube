'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Keyboard, X, Flag, Loader2 } from 'lucide-react';
import { store } from '@/lib/store';
import { api } from '@/lib/api';
import { Video } from '@/lib/types';
import { VideoPlayer, VideoPlayerRef } from '@/components/workspace/VideoPlayer';
import { PersonalNotesPanel } from '@/components/workspace/PersonalNotesPanel';
import { AiNotesPanel } from '@/components/workspace/AiNotesPanel';
import { AskAiPanel } from '@/components/workspace/AskAiPanel';
import { CodeEditorSandbox } from '@/components/workspace/CodeEditorSandbox';
import { FormulaScratchpad } from '@/components/workspace/FormulaScratchpad';
import { ConceptOrganizer } from '@/components/workspace/ConceptOrganizer';
import { QuizPanel } from '@/components/workspace/QuizPanel';
import { RatingModal } from '@/components/workspace/RatingModal';
import { ReportModal } from '@/components/workspace/ReportModal';
import { formatTimestamp } from '@/lib/utils';
import { calculateBayesianRating } from '@/lib/ranking';
import { analytics } from '@/lib/analytics';

type AdaptiveToolMode = 'math' | 'concepts' | 'code';

export default function WatchPage() {
  const params = useParams();
  const videoId = params?.videoId as string;
  const playerRef = useRef<VideoPlayerRef>(null);

  const [activeTab, setActiveTab] = useState<'notes' | 'adaptive' | 'quiz' | 'ai_notes' | 'ask_ai' | 'chapters'>('notes');
  const [currentTime, setCurrentTime] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [video, setVideo] = useState<Video | null>(() => (videoId ? store.getVideoById(videoId) || null : null));
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(() => (videoId ? !store.getVideoById(videoId) : false));

  useEffect(() => {
    if (!videoId) return;
    const cached = store.getVideoById(videoId);
    if (cached) {
      setVideo(cached);
      setIsLoadingVideo(false);
      return;
    }

    let isMounted = true;
    setIsLoadingVideo(true);
    api
      .getVideo(videoId)
      .then(remote => {
        if (!isMounted) return;
        if (remote) {
          store.addDiscoveredVideo(remote);
          setVideo(remote);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingVideo(false);
      });

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const topic = video ? store.getTopics().find(t => t.id === video.primaryTopicId) : undefined;

  const initialAdaptiveMode: AdaptiveToolMode = useMemo(() => {
    const user = store.getCurrentUser() || store.user;
    if (user?.workspaceMode && user.workspaceMode !== 'auto') {
      if (user.workspaceMode === 'math') return 'math';
      if (user.workspaceMode === 'code') return 'code';
      if (user.workspaceMode === 'concepts') return 'concepts';
    }

    if (!video) return 'concepts';
    const tId = (video.primaryTopicId || '').toLowerCase();
    const domain = (topic?.domain || '').toLowerCase();
    const subjectId = (topic?.subjectId || '').toLowerCase();

    if (
      tId.includes('physics') ||
      tId.includes('math') ||
      tId.includes('chem') ||
      subjectId === 'physics' ||
      subjectId === 'mathematics' ||
      subjectId === 'chemistry' ||
      domain === 'stem'
    ) {
      return 'math';
    }

    if (
      tId.includes('react') ||
      tId.includes('dsa') ||
      tId.includes('tree') ||
      tId.includes('system_design') ||
      tId.includes('javascript') ||
      subjectId === 'computer_science' ||
      subjectId === 'programming' ||
      domain === 'tech'
    ) {
      return 'code';
    }

    return 'concepts';
  }, [video, topic]);

  const [adaptiveToolMode, setAdaptiveToolMode] = useState<AdaptiveToolMode>(initialAdaptiveMode);

  useEffect(() => {
    setAdaptiveToolMode(initialAdaptiveMode);
  }, [initialAdaptiveMode]);

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
        setActiveTab('adaptive');
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

  useEffect(() => {
    if (videoId) {
      analytics.track('video_opened', { videoId });
    }
  }, [videoId]);

  if (isLoadingVideo && !video) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-3">
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-600">Loading YouTube lesson workspace...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-3">
        <h2 className="text-lg font-medium text-slate-900">Video not found</h2>
        <Link href="/feed" className="text-sm text-indigo-600 hover:underline">
          Return to feed
        </Link>
      </div>
    );
  }

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
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left: Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPlayer
            ref={playerRef}
            providerVideoId={video.providerVideoId}
            title={video.title}
            onTimeUpdate={(time) => setCurrentTime(time)}
          />

          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {video.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">{video.channelTitle}</span>
                  {topic && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-indigo-600 font-medium">{topic.name}</span>
                    </>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-800 font-medium">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {bayesianRating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSaveToLibrary}
                  disabled={isSaved}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Rate
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  title="Report inaccuracy"
                  className="p-2 rounded-xl text-slate-500 hover:text-amber-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                  aria-label="Report inaccuracy"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {video.description && (
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {video.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Adaptive Study Workspace (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[600px] lg:h-[700px] border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {/* Tabs Bar */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none shrink-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`min-w-[68px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'notes'
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Notes
            </button>

            <button
              onClick={() => setActiveTab('adaptive')}
              className={`min-w-[82px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'adaptive'
                  ? 'border-indigo-600 text-indigo-600 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {adaptiveToolMode === 'math' ? 'Formulas' : adaptiveToolMode === 'concepts' ? 'Concepts' : 'Code'}
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`min-w-[64px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'quiz'
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Quiz
            </button>

            <button
              onClick={() => setActiveTab('ai_notes')}
              className={`min-w-[78px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'ai_notes'
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              AI Notes
            </button>

            <button
              onClick={() => setActiveTab('ask_ai')}
              className={`min-w-[68px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'ask_ai'
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Ask AI
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`min-w-[78px] sm:flex-1 py-3 px-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap text-center ${
                activeTab === 'chapters'
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Chapters
            </button>
          </div>

          {/* Sub-header mode switcher for Adaptive Tool */}
          {activeTab === 'adaptive' && (
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Tool</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAdaptiveToolMode('math')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    adaptiveToolMode === 'math'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Formulas
                </button>
                <button
                  onClick={() => setAdaptiveToolMode('concepts')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    adaptiveToolMode === 'concepts'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Concepts
                </button>
                <button
                  onClick={() => setAdaptiveToolMode('code')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    adaptiveToolMode === 'code'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Code
                </button>
              </div>
            </div>
          )}

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden p-4 bg-white">
            {activeTab === 'notes' && (
              <PersonalNotesPanel
                videoId={video.id}
                topicId={video.primaryTopicId}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'adaptive' && adaptiveToolMode === 'code' && (
              <CodeEditorSandbox
                videoId={video.id}
                topicId={video.primaryTopicId}
              />
            )}

            {activeTab === 'adaptive' && adaptiveToolMode === 'math' && (
              <FormulaScratchpad
                videoId={video.id}
                topicId={video.primaryTopicId}
              />
            )}

            {activeTab === 'adaptive' && adaptiveToolMode === 'concepts' && (
              <ConceptOrganizer
                video={video}
                currentTime={currentTime}
                onSeek={handleSeek}
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
              <div className="space-y-2 overflow-y-auto h-full">
                {video.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(chap.start)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-100 flex items-center justify-between text-sm text-slate-700 transition-colors"
                  >
                    <span>{chap.title}</span>
                    <span className="font-mono text-slate-500 text-xs shrink-0">
                      {formatTimestamp(chap.start)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shortcuts Trigger */}
      <div className="pt-4 mt-6 border-t border-slate-200 flex items-center">
        <button
          onClick={() => setShowShortcutsModal(true)}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[11px] font-mono text-slate-600">?</kbd>
          <span>Shortcuts</span>
        </button>
      </div>

      <RatingModal
        video={video}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="video"
        targetId={video.id}
        targetTitle={video.title}
      />

      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-slate-500" />
                <span>Keyboard Shortcuts</span>
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Notes</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs">1</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Adaptive Tool</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs">2</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Quiz / AI Notes / Ask AI / Chapters</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs">3 – 6</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Seek ±10s</span>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">J</kbd>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">L</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Rate Video</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs">R</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
