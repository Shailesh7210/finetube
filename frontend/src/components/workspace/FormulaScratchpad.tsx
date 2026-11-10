'use client';

import { useState } from 'react';
import { Save, Copy, Check, Trash2, Plus, ArrowRight } from 'lucide-react';
import { store } from '@/lib/store';

interface FormulaScratchpadProps {
  videoId?: string;
  topicId?: string;
}

interface StepItem {
  id: string;
  expression: string;
  annotation: string;
  result?: string;
}

const SYMBOL_PALETTES = {
  Calculus: ['∫', 'd/dx', '∂', '∑', '∏', 'lim', '∞', 'Δ', '∇'],
  Algebra: ['√', '±', '≠', '≈', '≤', '≥', '×', '÷', '·', 'x²', 'xⁿ'],
  Greek: ['α', 'β', 'γ', 'θ', 'λ', 'μ', 'π', 'σ', 'ω', 'Ω', 'ε₀'],
  Physics: ['F⃗', 'v⃗', 'a⃗', 'E⃗', 'B⃗', 'Δt', 'ρ', 'p⃗', 'λ', 'τ'],
  Chemistry: ['→', '⇌', '↑', '↓', 'ΔH', 'mol', 'pH', 'Ka', 'Kb', '°C']
};

const FORMULA_PRESETS = [
  { name: "Coulomb's Law", expr: "F = (1 / (4 * π * ε₀)) * (|q₁ * q₂| / r²)", note: "Electrostatic force" },
  { name: "Newton's 2nd Law", expr: "F⃗ = m * a⃗", note: "Net force = mass × acceleration" },
  { name: "Gauss's Law", expr: "∮ E⃗ · dA⃗ = Q_enclosed / ε₀", note: "Electric flux" },
  { name: "Kinetic Energy", expr: "E_k = 0.5 * m * v²", note: "Kinetic energy" },
  { name: "Quadratic Formula", expr: "x = (-b ± √(b² - 4ac)) / (2a)", note: "Quadratic roots" },
  { name: "Ideal Gas Law", expr: "P * V = n * R * T", note: "Ideal gas equation" }
];

export function FormulaScratchpad({ videoId, topicId }: FormulaScratchpadProps) {
  const [activePalette, setActivePalette] = useState<keyof typeof SYMBOL_PALETTES>('Calculus');
  const [currentInput, setCurrentInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: 'step_1',
      expression: 'E = m * c²',
      annotation: 'Mass-energy equivalence',
      result: 'Rest energy definition'
    }
  ]);
  const [stepAnnotation, setStepAnnotation] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const insertSymbol = (sym: string) => {
    setCurrentInput(prev => prev + sym);
  };

  const handleEvaluate = () => {
    setCalcError(null);
    setCalcResult(null);
    if (!currentInput.trim()) return;

    try {
      const sanitized = currentInput
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/²/g, '**2')
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/√([0-9.]+)/g, 'Math.sqrt($1)');

      if (/^[0-9+\-*/().\s*Math,sqrtPIE]+$/.test(sanitized)) {
        // eslint-disable-next-line no-eval
        const evaluated = Function(`"use strict"; return (${sanitized});`)();
        const formatted = Number.isFinite(evaluated)
          ? Number(evaluated.toFixed(6)).toString()
          : String(evaluated);
        setCalcResult(formatted);
      } else {
        setCalcResult('Symbolic formula entered');
      }
    } catch {
      setCalcError('Symbolic expression');
    }
  };

  const handleAddStep = () => {
    if (!currentInput.trim()) return;
    const newStep: StepItem = {
      id: `step_${Date.now()}`,
      expression: currentInput.trim(),
      annotation: stepAnnotation.trim() || 'Derivation step',
      result: calcResult || undefined
    };
    setSteps(prev => [...prev, newStep]);
    setCurrentInput('');
    setStepAnnotation('');
    setCalcResult(null);
    setCalcError(null);
  };

  const handleApplyPreset = (preset: typeof FORMULA_PRESETS[0]) => {
    setCurrentInput(preset.expr);
    setStepAnnotation(preset.note);
    setCalcResult(null);
    setCalcError(null);
  };

  const handleCopy = () => {
    const text = steps.map((s, idx) => `Step ${idx + 1}: ${s.expression}\n(${s.annotation})\n`).join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleSaveToNotes = () => {
    const markdown = steps
      .map((s, idx) => `**Step ${idx + 1}**: \`${s.expression}\`\n*${s.annotation}* ${s.result ? `→ Result: \`${s.result}\`` : ''}`)
      .join('\n\n');

    store.createNote({
      folderId: 'f_notes',
      type: 'PERSONAL',
      title: `Formula Scratchpad`,
      topicIds: topicId ? [topicId] : [],
      source: videoId ? { type: 'video', videoId } : undefined,
      content: { text: markdown },
      tags: ['formula', 'derivation']
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
        <span className="font-semibold text-slate-900">Formula Scratchpad</span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSaveToNotes}
            disabled={isSaved || steps.length === 0}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs text-white font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-40"
          >
            {isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Palette */}
      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {(Object.keys(SYMBOL_PALETTES) as (keyof typeof SYMBOL_PALETTES)[]).map(pal => (
            <button
              key={pal}
              onClick={() => setActivePalette(pal)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activePalette === pal
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pal}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 pt-0.5">
          {SYMBOL_PALETTES[activePalette].map(sym => (
            <button
              key={sym}
              type="button"
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-xs font-mono text-slate-800 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {FORMULA_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset)}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shrink-0 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEvaluate()}
            placeholder="Enter formula or calculation..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleEvaluate}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white rounded-xl transition-colors"
          >
            Evaluate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={stepAnnotation}
            onChange={e => setStepAnnotation(e.target.value)}
            placeholder="Step note (optional)..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300"
          />
          <button
            type="button"
            onClick={handleAddStep}
            disabled={!currentInput.trim()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white rounded-xl transition-colors disabled:opacity-40 inline-flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        {calcResult && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-800 flex items-center justify-between">
            <span>Result: <strong>{calcResult}</strong></span>
            <button
              onClick={() => {
                setCurrentInput(prev => (prev ? `${prev} = ${calcResult}` : calcResult));
                setCalcResult(null);
              }}
              className="text-xs text-emerald-700 underline hover:text-emerald-950"
            >
              Use Result
            </button>
          </div>
        )}

        {calcError && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            {calcError}
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
        {steps.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No steps added yet.
          </div>
        ) : (
          steps.map((st, idx) => (
            <div
              key={st.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-600 font-semibold">
                  Step {idx + 1}
                </span>
                <button
                  onClick={() => setSteps(prev => prev.filter(s => s.id !== st.id))}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 rounded-lg bg-white font-mono text-xs text-slate-900 border border-slate-200 overflow-x-auto">
                {st.expression}
              </div>

              {st.annotation && (
                <p className="text-xs text-slate-600">{st.annotation}</p>
              )}

              {st.result && (
                <div className="text-xs font-mono text-emerald-700 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>{st.result}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
