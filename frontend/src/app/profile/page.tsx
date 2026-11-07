'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { Check, ArrowRight } from 'lucide-react';

function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstSetup = searchParams.get('setup') === 'true';

  const { user, isAuthenticated, updateProfile } = useAuth();
  const allTopics = store.getTopics();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);
  const [strictFocusMode, setStrictFocusMode] = useState(true);
  const [followedTopicIds, setFollowedTopicIds] = useState<string[]>([]);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setLearningGoal(user.learningGoal || '');
      setPreferredLanguage(user.preferredLanguage || 'javascript');
      setDailyGoalMinutes(user.dailyGoalMinutes || 30);
      setStrictFocusMode(user.strictFocusMode ?? true);
      setFollowedTopicIds(user.followedTopicIds || ['react_hooks']);
    }
  }, [user]);

  const toggleTopic = (id: string) => {
    setFollowedTopicIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        learningGoal: learningGoal.trim(),
        preferredLanguage,
        dailyGoalMinutes,
        strictFocusMode,
        followedTopicIds
      });

      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);

      if (isFirstSetup) {
        setTimeout(() => {
          router.push('/feed');
        }, 1200);
      }
    } catch {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 space-y-1">
        {isFirstSetup && (
          <span className="text-[11px] font-semibold text-blue-400 block mb-1">
            Welcome to FineTube
          </span>
        )}
        <h1 className="text-2xl font-bold text-white">Customize Your Profile</h1>
        <p className="text-xs text-zinc-400">
          Tailor your followed curriculum topics, learning goals, and workspace defaults.
        </p>
      </div>

      {isSavedNotice && (
        <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center justify-between">
          <span>Profile preferences saved successfully.</span>
          <Link href="/feed" className="underline font-medium hover:text-white inline-flex items-center gap-1">
            Go to Feed <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Learner Details</h2>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 block">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 block">Primary Learning Goal</label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="e.g. Master React Hooks and Data Structures"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 block">Bio / Learning Notes</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of what you are currently studying..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>
        </div>

        {/* Followed Curriculum Topics */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80">
          <div>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Followed Topics</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Select the topics you want to see in your personalized feed:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allTopics.map(topic => {
              const selected = followedTopicIds.includes(topic.id);
              return (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`text-left p-3 rounded-md border text-xs transition-colors flex items-center justify-between ${
                    selected
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <span className="font-medium block text-zinc-200">{topic.name}</span>
                    <span className="text-[11px] text-zinc-500 line-clamp-1">{topic.description}</span>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    selected ? 'bg-white text-zinc-950 border-white' : 'border-zinc-700'
                  }`}>
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace & Study Preferences */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Learning Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 block">Default Code Sandbox Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 block">Daily Study Target</label>
              <select
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value={15}>15 minutes / day</option>
                <option value={30}>30 minutes / day</option>
                <option value={45}>45 minutes / day</option>
                <option value={60}>60 minutes / day</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900/40 border border-zinc-800">
            <div>
              <span className="text-xs font-medium text-zinc-200 block">Strict Topic Focus Mode</span>
              <span className="text-[11px] text-zinc-500">Only recommend videos matching your explicitly followed topics.</span>
            </div>
            <button
              type="button"
              onClick={() => setStrictFocusMode(!strictFocusMode)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                strictFocusMode ? 'bg-white' : 'bg-zinc-800'
              }`}
            >
              <span className={`block w-3.5 h-3.5 rounded-full transition-transform ${
                strictFocusMode ? 'bg-zinc-950 translate-x-4' : 'bg-zinc-400 translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <Link
            href="/feed"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip to Feed
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading profile...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
