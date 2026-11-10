'use client';

import { useState } from 'react';
import { Calculator, Save, Copy, Check, Sparkles, Trash2, Plus, ArrowRight } from 'lucide-react';
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
  { name: "Coulomb's Law", expr: "F = (1 / (4 * π * ε₀)) * (|q₁ * q₂| / r²)", note: "Electrostatic force between point charges" },
  { name: "Newton's 2nd Law", expr: "F⃗ = m * a⃗", note: "Net force equals mass times acceleration" },
  { name: "Gauss's Law", expr: "∮ E⃗ · dA⃗ = Q_enclosed / ε₀", note: "Total electric flux through closed surface" },
  { name: "Kinetic Energy", expr: "E_k = 0.5 * m * v²", note: "Work-energy theorem representation" },
  { name: "Quadratic Formula", expr: "x = (-b ± √(b² - 4ac)) / (2a)", note: "Roots of ax² + bx + c = 0" },
  { name: "Ideal Gas Law", expr: "P * V = n * R * T", note: "Equation of state for classical gas" }
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
      annotation: 'Mass-energy equivalence foundational premise',
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
      // Safe arithmetic evaluator for numerical scratchpad expressions
      const sanitized = currentInput
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/²/g, '**2')
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/√([0-9.]+)/g, 'Math.sqrt($1)');

      // Allow basic arithmetic expressions
      if (/^[0-9+\-*/().\s*Math,sqrtPIE]+$/.test(sanitized)) {
        // eslint-disable-next-line no-eval
        const evaluated = Function(`"use strict"; return (${sanitized});`)();
        const formatted = Number.isFinite(evaluated)
          ? Number(evaluated.toFixed(6)).toString()
          : String(evaluated);
        setCalcResult(formatted);
      } else {
        // Symbolic representation confirmation
        setCalcResult('Symbolic formula entered');
      }
    } catch {
      setCalcError('Symbolic or non-numeric expression');
    }
  };

  const handleAddStep = () => {
    if (!currentInput.trim()) return;
    const newStep: StepItem = {
      id: `step_${Date.now()}`,
      expression: currentInput.trim(),
      annotation: stepAnnotation.trim() || 'Calculation derivation step',
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
      title: `Formula Derivation & Scratchpad`,
      topicIds: topicId ? [topicId] : [],
      source: videoId ? { type: 'video', videoId } : undefined,
      content: { text: markdown },
      tags: ['formula', 'derivation', 'math-scratchpad']
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Bar with Mode, Presets, and Actions */}
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-zinc-200">Formula Scratchpad</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-1"
            title="Copy all derivation steps"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSaveToNotes}
            disabled={isSaved || steps.length === 0}
            className="px-2.5 py-1 rounded bg-blue-600/20 border border-blue-500/40 text-[11px] text-blue-400 hover:bg-blue-600/30 font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-40"
          >
            {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <Save className="w-3 h-3" />}
            <span>{isSaved ? 'Saved to Notes' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      {/* Palette Tabs & Keys */}
      <div className="space-y-1.5 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {(Object.keys(SYMBOL_PALETTES) as (keyof typeof SYMBOL_PALETTES)[]).map(pal => (
            <button
              key={pal}
              onClick={() => setActivePalette(pal)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activePalette === pal
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
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
              className="px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800/80 text-xs font-mono text-zinc-200 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <span className="text-[10px] uppercase font-semibold text-zinc-500 shrink-0">Presets:</span>
        {FORMULA_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset)}
            className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 shrink-0 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Input & Evaluation Form */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEvaluate()}
            placeholder="Type equation, expression or derivation step (e.g., F = G * (m1*m2)/r² or 2 * π * 5)..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleEvaluate}
            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded transition-colors"
          >
            Evaluate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={stepAnnotation}
            onChange={e => setStepAnnotation(e.target.value)}
            placeholder="Step description or physical interpretation (optional)..."
            className="flex-1 bg-zinc-900/60 border border-zinc-800/70 rounded px-2.5 py-1 text-[11px] text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <button
            type="button"
            onClick={handleAddStep}
            disabled={!currentInput.trim()}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold text-white rounded transition-colors disabled:opacity-40 inline-flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add Step</span>
          </button>
        </div>

        {/* Real-time Calculation Result / Status */}
        {calcResult && (
          <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span>Result / Preview: <strong>{calcResult}</strong></span>
            <button
              onClick={() => {
                setCurrentInput(prev => (prev ? `${prev} = ${calcResult}` : calcResult));
                setCalcResult(null);
              }}
              className="text-[10px] text-emerald-300 underline hover:text-white"
            >
              Append to Input
            </button>
          </div>
        )}

        {calcError && (
          <div className="p-1.5 bg-amber-950/20 border border-amber-800/30 rounded text-[11px] text-amber-400">
            {calcError}
          </div>
        )}
      </div>

      {/* Derivation Steps List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold uppercase">
          <span>Problem-Solving Steps ({steps.length})</span>
          {steps.length > 0 && (
            <button
              onClick={() => setSteps([])}
              className="text-zinc-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {steps.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">
            No derivation steps yet. Enter formulas, click <strong>Add Step</strong>, or load a preset above.
          </div>
        ) : (
          steps.map((st, idx) => (
            <div
              key={st.id}
              className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800/80 space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-blue-400 font-semibold">
                  Step {idx + 1}
                </span>
                <button
                  onClick={() => setSteps(prev => prev.filter(s => s.id !== st.id))}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity"
                  title="Remove step"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="p-1.5 rounded bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-800/50 overflow-x-auto">
                {st.expression}
              </div>

              {st.annotation && (
                <p className="text-[11px] text-zinc-400 italic">
                  {st.annotation}
                </p>
              )}

              {st.result && (
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
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
