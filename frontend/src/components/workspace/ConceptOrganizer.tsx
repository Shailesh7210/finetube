'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Save, Check, Trash2 } from 'lucide-react';
import { Video } from '@/lib/types';
import { store } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

interface ConceptCard {
  id: string;
  term: string;
  category: string;
  definition: string;
  significance?: string;
  timestampSeconds?: number;
}

interface ConceptOrganizerProps {
  video: Video;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

const ARCHETYPE_DECKS: Record<string, ConceptCard[]> = {
  med_cardiovascular_physiology: [
    {
      id: 'c_med_1',
      term: 'Cardiac Output (CO)',
      category: 'Hemodynamics',
      definition: 'Volume of blood pumped by each ventricle per minute: CO = Heart Rate (HR) × Stroke Volume (SV).',
      significance: 'Primary clinical metric for systemic tissue perfusion (~5 L/min at rest).',
      timestampSeconds: 120
    },
    {
      id: 'c_med_2',
      term: 'Frank-Starling Mechanism',
      category: 'Physiological Law',
      definition: 'Increased venous return stretches ventricular myocardium, increasing preload and force of contraction.',
      significance: 'Automatically balances right and left ventricular output without neural input.',
      timestampSeconds: 310
    },
    {
      id: 'c_med_3',
      term: 'Sinoatrial (SA) Node',
      category: 'Anatomy / Pacemaker',
      definition: 'Specialized myocardial tissue in the superior right atrium generating spontaneous action potentials.',
      significance: 'Normal sinus rhythm (60-100 bpm) overrides slower AV nodal pacemakers.',
      timestampSeconds: 45
    }
  ],
  hist_french_revolution: [
    {
      id: 'c_hist_1',
      term: 'Estates-General (1789)',
      category: 'Political Assembly',
      definition: 'Legislative body comprising Clergy (1st), Nobility (2nd), and Commoners/Bourgeoisie (3rd Estate).',
      significance: 'Structural voting deadlock sparked the National Assembly Tennis Court Oath.',
      timestampSeconds: 95
    },
    {
      id: 'c_hist_2',
      term: 'Declaration of the Rights of Man',
      category: 'Foundational Document',
      definition: '1789 charter asserting universal male natural rights, popular sovereignty, and equality before law.',
      significance: 'Dismantled feudal privilege and laid blueprint for modern constitutional democracies.',
      timestampSeconds: 340
    }
  ],
  chem_organic_reactions: [
    {
      id: 'c_chem_1',
      term: "Markovnikov's Rule",
      category: 'Reaction Mechanism',
      definition: 'In hydrohalogenation of unsymmetrical alkenes, the proton adds to the carbon with more hydrogens.',
      significance: 'Driven by relative thermodynamic stability of secondary/tertiary carbocation intermediates.',
      timestampSeconds: 180
    },
    {
      id: 'c_chem_2',
      term: 'Nucleophile vs. Electrophile',
      category: 'Core Reactivity',
      definition: 'Nucleophiles donate electron pairs (Lewis bases); electrophiles accept electron pairs (Lewis acids).',
      significance: 'Curved-arrow notation always flows from electron-rich nucleophile toward electrophile.',
      timestampSeconds: 60
    }
  ],
  physics_electrostatics: [
    {
      id: 'c_phys_1',
      term: "Gauss's Law",
      category: 'Physical Law',
      definition: 'Electric flux through any closed Gaussian surface equals net enclosed charge divided by ε₀.',
      significance: 'Enables rapid electric field calculation for spherical, cylindrical, and planar symmetries.',
      timestampSeconds: 210
    }
  ]
};

export function ConceptOrganizer({ video, currentTime, onSeek }: ConceptOrganizerProps) {
  const [cards, setCards] = useState<ConceptCard[]>([]);
  const [recallMode, setRecallMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState('Key Concept');
  const [newDefinition, setNewDefinition] = useState('');
  const [newSignificance, setNewSignificance] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const archetype = ARCHETYPE_DECKS[video.primaryTopicId];
    if (archetype) {
      setCards(archetype);
    } else if (video.topicCoverage && video.topicCoverage.length > 0) {
      setCards(
        video.topicCoverage.map((tc, i) => ({
          id: `c_auto_${i}`,
          term: tc.conceptName,
          category: tc.level === 'demonstrated' ? 'Core Concept' : 'Principle',
          definition: `Key concept covered in this lecture (${tc.level}).`,
          timestampSeconds: video.chapters[i]?.start ?? 0
        }))
      );
    } else {
      setCards([
        {
          id: 'c_default_1',
          term: video.title,
          category: 'Overview',
          definition: video.description || 'Primary lecture concept.',
          timestampSeconds: 0
        }
      ]);
    }
    setRevealedIds({});
  }, [video.id]);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newDefinition.trim()) return;

    const card: ConceptCard = {
      id: `c_usr_${Date.now()}`,
      term: newTerm.trim(),
      category: newCategory.trim() || 'Concept',
      definition: newDefinition.trim(),
      significance: newSignificance.trim() || undefined,
      timestampSeconds: Math.floor(currentTime)
    };

    setCards(prev => [card, ...prev]);
    setNewTerm('');
    setNewDefinition('');
    setNewSignificance('');
    setShowAddForm(false);
  };

  const handleSaveDeckToLibrary = () => {
    if (cards.length === 0) return;

    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: `Concept Deck: ${video.title}`,
      topicIds: [video.primaryTopicId],
      source: {
        type: 'video',
        videoId: video.id
      },
      content: {
        sections: cards.map(c => ({
          heading: `${c.term} (${c.category})`,
          body: `${c.definition}${c.significance ? `\nSignificance: ${c.significance}` : ''}`,
          timestampSeconds: c.timestampSeconds
        }))
      },
      tags: ['concept-cards']
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
        <span className="font-semibold text-slate-900">Concepts & Cards</span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setRecallMode(prev => !prev);
              setRevealedIds({});
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors inline-flex items-center gap-1 ${
              recallMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {recallMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{recallMode ? 'Recall On' : 'Practice Recall'}</span>
          </button>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white transition-colors inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>

          <button
            onClick={handleSaveDeckToLibrary}
            disabled={isSaved || cards.length === 0}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs text-white font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-40"
          >
            {isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCard} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Term or event..."
              value={newTerm}
              onChange={e => setNewTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Category..."
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            placeholder="Definition or explanation..."
            value={newDefinition}
            onChange={e => setNewDefinition(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
            required
          />
          <input
            type="text"
            placeholder="Significance or note (optional)..."
            value={newSignificance}
            onChange={e => setNewSignificance(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-slate-500">
              At {formatTimestamp(currentTime)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Add Card
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {cards.map(card => {
          const isHidden = recallMode && !revealedIds[card.id];

          return (
            <div
              key={card.id}
              className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl space-y-2 group transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block text-[11px] font-medium text-indigo-600 mb-0.5">
                    {card.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{card.term}</h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {card.timestampSeconds !== undefined && (
                    <button
                      onClick={() => onSeek(card.timestampSeconds!)}
                      className="font-mono text-xs text-indigo-600 hover:underline font-medium"
                    >
                      {formatTimestamp(card.timestampSeconds)}
                    </button>
                  )}
                  <button
                    onClick={() => setCards(prev => prev.filter(c => c.id !== card.id))}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isHidden ? (
                <button
                  onClick={() => toggleReveal(card.id)}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-300 bg-white hover:bg-slate-100 text-xs text-slate-600 font-medium transition-colors"
                >
                  Click to Reveal Definition
                </button>
              ) : (
                <div
                  onClick={() => recallMode && toggleReveal(card.id)}
                  className={`space-y-1.5 ${recallMode ? 'cursor-pointer' : ''}`}
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {card.definition}
                  </p>
                  {card.significance && (
                    <p className="text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      <strong className="text-slate-900">Significance:</strong> {card.significance}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
