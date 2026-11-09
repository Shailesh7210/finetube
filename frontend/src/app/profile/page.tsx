'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { store } from '@/lib/store';
import { Check, ArrowRight, Download, Trash2, Shield, Plus, X, GraduationCap, Compass, BookOpen, Layers, Tag, Laptop } from 'lucide-react';
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
  { id: 'General Knowledge', label: 'General Knowledge & Lifelong' }
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

  const { user, isAuthenticated, updateProfile } = useAuth();
  const allSubjects = store.getSubjects();
  const allTopics = store.getTopics();

  // Basic Details
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [learningGoal, setLearningGoal] = useState('');

  // Multi-Dimensional Dimensions
  const [educationLevel, setEducationLevel] = useState('not_specified');
  const [stream, setStream] = useState('none');
  const [followedSubjectIds, setFollowedSubjectIds] = useState<string[]>([]);
  const [followedTopicIds, setFollowedTopicIds] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [workspaceMode, setWorkspaceMode] = useState<'auto' | 'notes' | 'math' | 'code'>('auto');

  // Study Settings
  const [preferredLanguage, setPreferredLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);
  const [strictFocusMode, setStrictFocusMode] = useState(true);

  // Status & Notifications
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Topic filter in UI
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
    setFollowedSubjectIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(s => s !== id) : [...prev, id];
      return next;
    });
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
    if (!window.confirm('Are you sure you want to request account erasure? All personal notes, preferences, and custom learning paths will be deleted in accordance with GDPR right-to-be-forgotten.')) {
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
        }, 1200);
      }
    } catch {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 space-y-1">
        {isFirstSetup && (
          <span className="text-[11px] font-semibold text-blue-400 block mb-1">
            Welcome to FineTube
          </span>
        )}
        <h1 className="text-2xl font-bold text-white">Universal Learning Profile</h1>
        <p className="text-xs text-zinc-400">
          Configure your <strong>educational background</strong>, <strong>subjects</strong>, and <strong>specific learning interests</strong> to ensure your feed shows only relevant educational content.
        </p>
      </div>

      {isSavedNotice && (
        <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center justify-between">
          <span>Learning profile updated successfully!</span>
          <Link href="/feed" className="underline font-medium hover:text-white inline-flex items-center gap-1">
            Go to Your Feed <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {deleteSuccess && (
        <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
          Account data purged. Redirecting to home...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dimension 1 & 2: Education Level and Academic Stream */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              1. Education Level & Academic Focus (Optional)
            </h2>
          </div>
          <p className="text-[11px] text-zinc-500">
            Education level and learning interests are separate dimensions. You are never forced into a single track or proficiency tier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 block">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                {EDUCATION_LEVEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 block">Academic Stream / Field</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                {STREAM_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dimension 3: Multi-Subject Selection */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              2. Selected Subjects
            </h2>
          </div>
          <p className="text-[11px] text-zinc-500">
            Select one or multiple subjects. FineTube covers sciences, mathematics, humanities, medicine, economics, tech, and beyond.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {allSubjects.map(sub => {
              const isSelected = followedSubjectIds.includes(sub.id);
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-medium truncate">{sub.name}</span>
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-white text-zinc-950 border-white' : 'border-zinc-700'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimension 4: Specific Topics Explorer */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                3. Specific Curriculum Topics
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500">
              <strong>{followedTopicIds.length}</strong> topics followed
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Follow individual topics to focus your feed on specific chapters and domains:
          </p>

          {/* Subject Filter for Topics */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              type="button"
              onClick={() => setTopicFilterSubject('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors shrink-0 ${
                topicFilterSubject === 'all'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {followedSubjectIds.length > 0 ? 'Selected Subjects' : 'All Topics'}
            </button>
            {allSubjects.map(sub => (
              <button
                type="button"
                key={sub.id}
                onClick={() => setTopicFilterSubject(sub.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors shrink-0 ${
                  topicFilterSubject === sub.id
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {displayedTopics.map(topic => {
              const selected = followedTopicIds.includes(topic.id);
              return (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition-colors flex items-start justify-between gap-2 ${
                    selected
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-medium block text-zinc-200">{topic.name}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {topic.educationLevel && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {topic.educationLevel}
                        </span>
                      )}
                      {topic.stream && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {topic.stream}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                    selected ? 'bg-white text-zinc-950 border-white' : 'border-zinc-700'
                  }`}>
                    {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimension 5: Custom Interests (Freeform Tags) */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              4. Custom Learning Interests
            </h2>
          </div>
          <p className="text-[11px] text-zinc-500">
            Add custom topics, exam titles, or specialized niches (e.g., <em>Organic Chemistry</em>, <em>Human Anatomy</em>, <em>French Revolution</em>, <em>React Hooks</em>):
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add custom interest tag..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
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
              className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tag
            </button>
          </div>

          {customInterests.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {customInterests.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomInterest(tag)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dimension 6: Learning Workspace Mode & Study Target */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              5. Workspace Adaptation & Goals
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 block">Workspace Tools Mode</label>
              <select
                value={workspaceMode}
                onChange={(e) => setWorkspaceMode(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value="auto">Auto-Detect (Adapts to lecture subject)</option>
                <option value="notes">Rich Notes & Concept Organizer</option>
                <option value="math">Mathematics & Formula Scratchpad</option>
                <option value="code">Developer Code Sandbox</option>
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
                <option value={120}>2 hours / day</option>
              </select>
            </div>
          </div>

          {/* Optional Developer Language (only if user studies coding) */}
          <div className="pt-2 border-t border-zinc-800/60">
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">
              Optional: Default Sandbox Language (for Software & Computer Science)
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as any)}
              className="w-full sm:w-1/2 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        {/* General Learner Details */}
        <div className="space-y-4 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            6. Learner Profile Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="text-xs font-medium text-zinc-300 block">Primary Learning Objective</label>
              <input
                type="text"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                placeholder="e.g. Master Class 12 Physics & Organic Chemistry"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 block">Bio / Notes</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What are you currently preparing or curious about?"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Profile...' : isFirstSetup ? 'Complete Setup & Open Feed' : 'Save Learning Profile'}
          </button>

          <Link
            href="/settings/interests"
            className="text-xs text-zinc-400 hover:text-white underline transition-colors"
          >
            Manage Feed Recommendation Filters →
          </Link>
        </div>
      </form>

      {/* Usage Quota Card */}
      <div className="pt-8 border-t border-zinc-800/80">
        <UsageQuotaCard />
      </div>

      {/* Account Erasure & Data Portability */}
      <div className="pt-8 border-t border-zinc-800/80 space-y-4">
        <div>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-500" />
            GDPR Data Portability & Privacy
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            You own your educational data. Export your notes and learning pathways at any time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export Complete Learner Data (JSON)'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="px-3.5 py-2 rounded-md bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/40 text-xs text-rose-300 inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Erasing...' : 'Delete Account & Erase All Data'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-zinc-500">Loading learning profile...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
