"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, Zap } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { submitCardResult } from "@/lib/actions/study";

const HanziWriterCanvas = dynamic(() => import("@/components/ui/HanziWriter"), { ssr: false });

export interface StudyWord {
  id: string;
  simplified: string;
  pinyin: string;
  meanings: string[];
  example: string;
  exampleTranslation: string;
  hskLevel: number;
  masteryLevel: number;
}

interface StudyClientProps {
  lessonId: string;
  words: StudyWord[];
}

type Phase = "front" | "back" | "complete";
interface Result { word: StudyWord; correct: boolean }

export default function StudyClient({ lessonId, words }: StudyClientProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("front");
  const [results, setResults] = useState<Result[]>([]);
  const [showStroke, setShowStroke] = useState(false);
  const [saving, setSaving] = useState(false);

  const word = words[index];
  const progress = (index / words.length) * 100;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && phase === "front") { e.preventDefault(); setPhase("back"); }
      if (e.key === "ArrowRight" && phase === "back") respond(true);
      if (e.key === "ArrowLeft" && phase === "back") respond(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  const respond = useCallback(async (correct: boolean) => {
    if (saving) return;
    setSaving(true);

    try {
      await submitCardResult(word.id, correct);
    } catch {
      // fail silently — result still recorded locally
    }

    const newResults = [...results, { word, correct }];
    setResults(newResults);

    if (index + 1 >= words.length) {
      setPhase("complete");
    } else {
      setIndex(index + 1);
      setPhase("front");
      setShowStroke(false);
    }
    setSaving(false);
  }, [saving, word, results, index, words.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setPhase("front");
    setResults([]);
    setShowStroke(false);
  }, []);

  if (phase === "complete") {
    const correct = results.filter((r) => r.correct).length;
    const pct = Math.round((correct / results.length) * 100);
    const xpEarned = results.reduce((sum, r) => sum + (r.correct ? 2 : 1), 0);

    return (
      <div className="max-w-md mx-auto space-y-6 pt-8">
        <div className="card p-8 text-center space-y-4">
          <div className="text-6xl">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
          <h2 className="text-2xl font-bold text-ink-primary">Lesson Complete!</h2>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="card-elevated p-3 text-center">
              <p className="text-2xl font-bold text-jade-400">{correct}</p>
              <p className="text-xs text-ink-muted mt-0.5">Correct</p>
            </div>
            <div className="card-elevated p-3 text-center">
              <p className="text-2xl font-bold text-brand-400">{results.length - correct}</p>
              <p className="text-xs text-ink-muted mt-0.5">Incorrect</p>
            </div>
            <div className="card-elevated p-3 text-center">
              <p className="text-2xl font-bold text-gold-400">{pct}%</p>
              <p className="text-xs text-ink-muted mt-0.5">Accuracy</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
            <Zap size={16} className="text-gold-400" />
            <span className="font-bold text-gold-400">+{xpEarned} XP earned</span>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button type="button" onClick={restart} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all">
              <RotateCcw size={15} /> Practice Again
            </button>
            <Link href={`/learn/${lessonId}`} className="flex items-center justify-center py-3 rounded-xl bg-surface-2 border border-surface-border text-ink-secondary hover:text-ink-primary hover:bg-surface-3 font-medium text-sm transition-all">
              Back to Lesson
            </Link>
            <Link href="/dashboard" className="flex items-center justify-center py-3 rounded-xl bg-surface-2 border border-surface-border text-ink-secondary hover:text-ink-primary hover:bg-surface-3 font-medium text-sm transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {results.filter((r) => !r.correct).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-3 px-1">Review Mistakes</h3>
            <div className="space-y-2">
              {results.filter((r) => !r.correct).map((r) => (
                <div key={r.word.id} className="card flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl font-bold text-ink-primary">{r.word.simplified}</span>
                  <div>
                    <p className="text-sm font-medium text-brand-400">{r.word.pinyin}</p>
                    <p className="text-xs text-ink-secondary">{r.word.meanings[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Link href={`/learn/${lessonId}`} className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-surface-border text-ink-muted hover:text-ink-secondary transition-colors">
          <ArrowLeft size={15} />
        </Link>
        <div className="flex-1 h-2.5 rounded-full bg-surface-2 border border-surface-border overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-medium text-ink-secondary w-12 text-right shrink-0">{index + 1}/{words.length}</span>
      </div>

      {/* Card */}
      <div className="card min-h-[420px] flex flex-col items-center justify-center p-8 relative overflow-hidden text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          <span className="text-[200px] font-bold text-surface-border/30 leading-none">{word.simplified[0]}</span>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center gap-5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-jade-500/15 text-jade-400 border border-jade-500/25">
            HSK {word.hskLevel}
          </span>

          <div className="text-7xl font-bold text-ink-primary leading-none tracking-tight">{word.simplified}</div>

          {phase === "back" && (
            <div className="w-full space-y-4">
              <div>
                <p className="text-xl font-semibold text-brand-400">{word.pinyin}</p>
                <p className="text-base text-ink-primary mt-1">{word.meanings.join(" / ")}</p>
              </div>

              {word.example && (
                <div className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-surface-border text-left">
                  <p className="text-sm text-ink-primary font-medium">{word.example}</p>
                  <p className="text-xs text-ink-muted mt-1 italic">{word.exampleTranslation}</p>
                </div>
              )}

              <button type="button" onClick={() => setShowStroke((s) => !s)} className="text-xs text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-2">
                {showStroke ? "Hide" : "Show"} stroke order
              </button>

              {showStroke && (
                <div className="flex justify-center">
                  <HanziWriterCanvas character={word.simplified[0]} width={180} height={180} mode="animate" />
                </div>
              )}
            </div>
          )}

          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-surface-border text-ink-muted hover:text-ink-secondary hover:bg-surface-3 transition-all text-xs">
            <Volume2 size={13} /> Play audio
          </button>
        </div>
      </div>

      {/* Actions */}
      {phase === "front" ? (
        <button type="button" onClick={() => setPhase("back")} className="w-full py-3.5 rounded-xl bg-surface-2 border border-surface-border text-ink-primary font-semibold hover:bg-surface-3 transition-all">
          Reveal Answer
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => respond(false)} disabled={saving} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600/10 border border-brand-600/30 text-brand-400 font-semibold hover:bg-brand-600/20 disabled:opacity-50 transition-all">
            <XCircle size={18} /> Needs work
          </button>
          <button type="button" onClick={() => respond(true)} disabled={saving} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-jade-500/10 border border-jade-500/30 text-jade-400 font-semibold hover:bg-jade-500/20 disabled:opacity-50 transition-all">
            <CheckCircle size={18} /> Got it!
          </button>
        </div>
      )}

      <p className="text-center text-xs text-ink-muted">
        {phase === "front" ? "Press Space to reveal" : "← Needs work  ·  → Got it!"}
      </p>
    </div>
  );
}
