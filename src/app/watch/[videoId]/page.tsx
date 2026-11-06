'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { 
  FileText, 
  Terminal, 
  Sparkles, 
  ListTree, 
  Star, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { store } from '../../../lib/store';
import { VideoPlayer, VideoPlayerRef } from '../../../components/workspace/VideoPlayer';
import { PersonalNotesPanel } from '../../../components/workspace/PersonalNotesPanel';
import { AiNotesPanel } from '../../../components/workspace/AiNotesPanel';
import { CodeEditorSandbox } from '../../../components/workspace/CodeEditorSandbox';
import { RatingModal } from '../../../components/workspace/RatingModal';
import { formatTimestamp, formatDuration } from '../../../lib/utils';
import { calculateBayesianRating, calculateTopicScore } from '../../../lib/ranking';

export default function WatchPage() {
  const params = useParams();
  const videoId = params?.videoId as string;
  const playerRef = useRef<VideoPlayerRef>(null);

  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'ai_notes' | 'chapters'>('notes');
  const [currentTime, setCurrentTime] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSavedInLibrary, setIsSavedInLibrary] = useState(false);

  const video = store.getVideoById(videoId);
  if (!video) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Video Not Found</h2>
        <p className="text-xs text-slate-400">The video requested is not in the educational catalog.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 rounded text-xs font-medium text-white">
          <ArrowLeft className="w-4 h-4" /> Return to Feed
        </Link>
      </div>
    );
  }

  const topic = store.getTopics().find(t => t.id === video.primaryTopicId);
  const ranking = calculateTopicScore(video, topic);
  const bayesianRating = calculateBayesianRating(video.ratingAverage, video.ratingCount);

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  const handleQuickSave = () => {
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
        text: `Bookmarked lecture for topic ${topic?.name || 'Computer Science'}`
      },
      tags: ['bookmark', 'study']
    });
    setIsSavedInLibrary(true);
    setTimeout(() => setIsSavedInLibrary(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
          </Link>
          <span>/</span>
          {topic && (
            <Link href={`/topics/${topic.slug}`} className="text-brand-400 hover:underline">
              {topic.name}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Save to Library */}
          <button
            onClick={handleQuickSave}
            disabled={isSavedInLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-sm"
          >
            {isSavedInLibrary ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved in Library</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </>
            )}
          </button>

          {/* Rate Video Button */}
          <button
            onClick={() => setIsRatingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Rate Explanation</span>
          </button>
        </div>
      </div>

      {/* Main Learning Workspace Split Layout (Blueprint Section 8.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPlayer
            ref={playerRef}
            providerVideoId={video.providerVideoId}
            title={video.title}
            onTimeUpdate={(time) => setCurrentTime(time)}
          />

          {/* Video Metadata & Evidence Score */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                  {video.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Presented by <span className="text-slate-300 font-medium">{video.channelTitle}</span>
                </p>
              </div>

              {/* Topic Score Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-brand-500/40 text-center">
                  <div className="flex items-center justify-center gap-1 text-brand-300 font-mono font-bold text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    {ranking.score}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Quality Score</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-mono font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {bayesianRating}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{video.ratingCount} Ratings</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {video.description}
            </p>

            {/* Evidence & Concepts Checklist */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Evidenced Concept Coverage
              </span>
              <div className="flex flex-wrap gap-2">
                {video.topicCoverage.map((item) => (
                  <div
                    key={item.conceptId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium">{item.conceptName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Learning Tools (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[740px]">
          {/* Tool Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-3 shrink-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_notes')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai_notes'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'chapters'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Chapters</span>
            </button>
          </div>

          {/* Active Tool View */}
          <div className="flex-1 overflow-hidden">
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

            {activeTab === 'ai_notes' && (
              <AiNotesPanel
                video={video}
                onSeek={handleSeek}
              />
            )}

            {activeTab === 'chapters' && (
              <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-2.5 overflow-y-auto">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800">
                  Video Chapters
                </h3>
                {video.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(chap.start)}
                    className="w-full text-left p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs transition-colors group"
                  >
                    <span className="font-medium text-slate-200 group-hover:text-brand-300">
                      {chap.title}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px] shrink-0">
                      {formatTimestamp(chap.start)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bayesian Rating Modal */}
      <RatingModal
        video={video}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
      />
    </div>
  );
}
