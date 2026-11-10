'use client';

import { useState } from 'react';
import { Send, Clock, Bookmark } from 'lucide-react';
import { Video } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { store } from '@/lib/store';

interface Citation {
  timestampSeconds: number;
  segmentId?: string;
  chapterTitle?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  isCovered?: boolean;
}

interface AskAiPanelProps {
  video: Video;
  onSeek: (seconds: number) => void;
}

export function AskAiPanel({ video, onSeek }: AskAiPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Ask any question about "${video.title}".`,
      isCovered: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedMessageId, setSavedMessageId] = useState<string | null>(null);

  const suggestedPrompts = (() => {
    const tId = (video.primaryTopicId || '').toLowerCase();
    if (tId.includes('physics')) {
      return [
        'How does Gauss’s Law determine the electric field?',
        'What are the boundary assumptions?'
      ];
    }
    if (tId.includes('chem')) {
      return [
        'What governs regioselectivity here?',
        'How does carbocation stability apply?'
      ];
    }
    if (tId.includes('med') || tId.includes('bio')) {
      return [
        'How is Cardiac Output regulated?',
        'What is the clinical significance?'
      ];
    }
    if (tId.includes('hist') || tId.includes('econ') || tId.includes('law')) {
      return [
        'What structural causes triggered this?',
        'What is the historical legacy?'
      ];
    }
    return [
      `Core takeaways of ${video.title}?`,
      'Explain the key concept step by step.'
    ];
  })();

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id, question: q })
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          citations: data.citations,
          isCovered: data.isCoveredInVideo
        };
        setMessages(prev => [...prev, aiMsg]);
        return;
      }
    } catch {
      // fallback
    }

    const lower = q.toLowerCase();
    let answer = `This concept is covered across the lecture chapters with focus on clarity and core principles.`;
    let citations: Citation[] = [];
    let isCovered = true;

    if (lower.includes('cleanup') || lower.includes('unmount')) {
      answer = 'The cleanup function executes before re-running the effect with new dependencies and when unmounting.';
      citations = [{ timestampSeconds: 540, chapterTitle: 'Cleanup functions' }];
    } else if (lower.includes('dependency') || lower.includes('array')) {
      answer = 'React uses Object.is shallow comparison between renders to determine if effects should re-run.';
      citations = [{ timestampSeconds: 310, chapterTitle: 'Dependency array' }];
    } else if (video.chapters && video.chapters.length > 0) {
      citations = [{ timestampSeconds: video.chapters[0].start, chapterTitle: video.chapters[0].title }];
    } else {
      isCovered = false;
    }

    const aiMsg: Message = {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: answer,
      citations,
      isCovered
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleSaveToNotes = (msg: Message) => {
    store.createNote({
      folderId: 'f_ai',
      type: 'AI_GENERATED',
      title: `Q&A: ${msg.text.slice(0, 40)}...`,
      topicIds: [video.primaryTopicId],
      source: {
        type: 'video',
        videoId: video.id,
        timestampSeconds: msg.citations?.[0]?.timestampSeconds
      },
      content: { text: msg.text },
      tags: ['ask-ai']
    });
    setSavedMessageId(msg.id);
    setTimeout(() => setSavedMessageId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
        <span className="font-semibold text-slate-900">Ask AI</span>
        <span className="text-slate-500">Video-grounded</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleAsk(prompt)}
            className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3.5 rounded-xl border ${
              msg.sender === 'user'
                ? 'bg-indigo-50 border-indigo-200 text-slate-900 ml-6'
                : 'bg-slate-50 border-slate-200 text-slate-800 mr-2 space-y-2'
            }`}
          >
            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

            {msg.citations && msg.citations.length > 0 && (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                {msg.citations.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSeek(c.timestampSeconds)}
                    className="inline-flex items-center gap-1 text-xs font-mono text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(c.timestampSeconds)}</span>
                  </button>
                ))}
              </div>
            )}

            {msg.sender === 'assistant' && msg.id !== 'welcome' && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSaveToNotes(msg)}
                  className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{savedMessageId === msg.id ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 animate-pulse">
            Analyzing lecture evidence...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(input);
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this video..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
