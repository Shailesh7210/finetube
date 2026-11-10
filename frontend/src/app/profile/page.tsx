'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { Check, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { UsageQuotaCard } from '@/components/profile/UsageQuotaCard';

const EDUCATION_LEVEL_OPTIONS = [
  { id: 'not_specified', label: 'Open Learner / Not Specified' },
  { id: 'Class 12', label: 'Class 12 (Secondary School)' },
  { id: 'Class 11', label: 'Class 11 (Secondary School)' },
  { id: 'Medical Studies', label: 'Medical Studies & Clinical' },
  { id: 'Undergraduate', label: 'Undergraduate / College' },
  { id: 'Postgraduate', label: 'Postgraduate & Research' },
  { id: 'Professional', label: 'Working Professional' },
  { id: 'Competitive Exams', label: 'Competitive Examination Prep' },
  { id: 'General Knowledge', label: 'General Knowledge' }
];

const STREAM_OPTIONS = [
  { id: 'none', label: 'General / Interdisciplinary' },
  { id: 'Science', label: 'Science (Physics, Chemistry, Math)' },
  { id: 'Medical', label: 'Medical & Healthcare' },
  { id: 'Computer Science', label: 'Computer Science & Software' },
  { id: 'Commerce', label: 'Commerce, Economics & Finance' },
  { id: 'Humanities', label: 'Humanities, History & Arts' },
  { id: 'Engineering', label: 'Engineering & Technology' },
  { id: 'Law', label: 'Law & Governance' }
];

function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstSetup = searchParams.get('setup') === 'true';

  const { user, updateProfile } = useAuth();
  const allSubjects = store.getSubjects();
  const allTopics = store.getTopics();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [learningGoal, setLearningGoal] = useState('');

  const [educationLevel, setEducationLevel] = useState('not_specified');
  const [stream, setStream] = useState('none');
  const [followedSubjectIds, setFollowedSubjectIds] = useState<string[]>([]);
  const [followedTopicIds, setFollowedTopicIds] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [workspaceMode, setWorkspaceMode] = useState<'auto' | 'notes' | 'math' | 'code' | 'concepts' | 'timeline'>('auto');

  const [preferredLanguage, setPreferredLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);
  const [strictFocusMode, setStrictFocusMode] = useState(true);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [topicFilterSubject, setTopicFilterSubject] = useState<string>('all');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setLearningGoal(user.learningGoal || '');
      setEducationLevel(user.educationLevel || 'not_specified');
      setStream(user.stream || 'none');
      setFollowedSubjectIds(user.followedSubjectIds || []);
      setFollowedTopicIds(user.followedTopicIds || []);
      setCustomInterests(user.customInterests || []);
      setWorkspaceMode(user.workspaceMode || 'auto');
      setPreferredLanguage(user.preferredLanguage || 'javascript');
      setDailyGoalMinutes(user.dailyGoalMinutes || 30);
      setStrictFocusMode(user.strictFocusMode ?? true);
    }
  }, [user]);

  const toggleSubject = (id: string) => {
    setFollowedSubjectIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleTopic = (id: string) => {
    setFollowedTopicIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim();
    if (tag && !customInterests.some(t => t.toLowerCase() === tag.toLowerCase())) {
      setCustomInterests(prev => [...prev, tag]);
      setNewTagInput('');
    }
  };

  const handleRemoveCustomInterest = (tagToRemove: string) => {
    setCustomInterests(prev => prev.filter(t => t !== tagToRemove));
  };

  const displayedTopics = useMemo(() => {
    if (topicFilterSubject === 'all') {
      if (followedSubjectIds.length > 0) {
        return allTopics.filter(t => followedSubjectIds.includes(t.subjectId));
      }
      return allTopics;
    }
    return allTopics.filter(t => t.subjectId === topicFilterSubject);
  }, [allTopics, topicFilterSubject, followedSubjectIds]);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await api.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finetube-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account and erase all personal notes and preferences?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.deleteAccount();
      setDeleteSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        learningGoal: learningGoal.trim(),
        educationLevel: educationLevel === 'not_specified' ? undefined : educationLevel,
        stream: stream === 'none' ? undefined : stream,
        followedSubjectIds,
        followedTopicIds,
        customInterests,
        workspaceMode,
        preferredLanguage,
        dailyGoalMinutes,
        strictFocusMode
      });

      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);

      if (isFirstSetup) {
        setTimeout(() => {
          router.push('/feed');
        }, 1000);
      }
    } catch {
      // handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Learning Profile</h1>
      </div>

      {isSavedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between">
          <span>Profile updated.</span>
          <Link href="/feed" className="underline font-semibold hover:text-emerald-950">
            Open Feed →
          </Link>
        </div>
      )}

      {deleteSuccess && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-sm text-slate-700">
          Account data purged. Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Education Level & Stream */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Education Background</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                {EDUCATION_LEVEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Academic Stream / Field</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                {STREAM_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Subjects</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allSubjects.map(sub => {
              const isSelected = followedSubjectIds.includes(sub.id);
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`text-left p-3.5 rounded-xl border text-sm transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific Topics */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Topics</h2>
            <span className="text-sm text-slate-500">{followedTopicIds.length} selected</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              type="button"
              onClick={() => setTopicFilterSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                topicFilterSubject === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {followedSubjectIds.length > 0 ? 'Selected Subjects' : 'All'}
            </button>
            {allSubjects.map(sub => (
              <button
                type="button"
                key={sub.id}
                onClick={() => setTopicFilterSubject(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  topicFilterSubject === sub.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {displayedTopics.map(topic => {
              const selected = followedTopicIds.includes(topic.id);
              return (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`text-left p-3.5 rounded-xl border text-sm transition-colors flex items-center justify-between gap-2 ${
                    selected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{topic.name}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    selected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 bg-white'
                  }`}>
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Interests */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Custom Interests</h2>

          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="e.g. Organic Chemistry, Anatomy, French Revolution..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomInterest(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomInterest}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {customInterests.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {customInterests.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomInterest(tag)}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Workspace Mode & Account Info */}
        <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Workspace & Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Default Workspace Tool</label>
              <select
                value={workspaceMode}
                onChange={(e) => setWorkspaceMode(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="auto">Auto-Detect by Subject</option>
                <option value="concepts">Concept Cards (Medicine / Humanities)</option>
                <option value="math">Formula Scratchpad (Math / Science)</option>
                <option value="code">Code Sandbox (Programming)</option>
                <option value="notes">Personal Notes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Daily Goal</label>
              <select
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value={15}>15 minutes / day</option>
                <option value={30}>30 minutes / day</option>
                <option value={45}>45 minutes / day</option>
                <option value={60}>60 minutes / day</option>
                <option value={120}>2 hours / day</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Learning Goal</label>
              <input
                type="text"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                placeholder="e.g. Class 12 Boards"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>

          <Link
            href="/settings/interests"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Manage Feed Filters →
          </Link>
        </div>
      </form>

      <div className="pt-8 border-t border-slate-200">
        <UsageQuotaCard />
      </div>

      {/* Privacy & Data */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Data & Privacy</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-sm text-slate-700 font-medium transition-colors disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export Data (JSON)'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-sm text-rose-700 font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-500">Loading profile...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
