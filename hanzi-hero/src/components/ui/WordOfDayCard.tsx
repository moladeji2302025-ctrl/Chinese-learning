import { Volume2, Star } from "lucide-react";

interface WordOfDayProps {
  character: string;
  pinyin: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  hskLevel: number;
}

export default function WordOfDayCard({
  character,
  pinyin,
  meaning,
  example,
  exampleTranslation,
  hskLevel,
}: WordOfDayProps) {
  return (
    <div className="card p-5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 text-8xl font-bold text-surface-border/60 select-none pointer-events-none leading-none">
        {character}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-gold-400 fill-gold-400" />
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Word of the Day
            </span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-jade-500/15 text-jade-400 border border-jade-500/25">
            HSK {hskLevel}
          </span>
        </div>

        <div className="flex items-end gap-4 mb-3">
          <span className="text-5xl font-bold text-ink-primary leading-none">{character}</span>
          <div className="pb-1">
            <p className="text-base font-medium text-brand-400">{pinyin}</p>
            <p className="text-sm text-ink-secondary">{meaning}</p>
          </div>
        </div>

        <div className="border-t border-surface-border pt-3 mt-3">
          <p className="text-sm text-ink-primary font-medium">{example}</p>
          <p className="text-xs text-ink-muted mt-0.5 italic">{exampleTranslation}</p>
        </div>

        <button
          type="button"
          className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-surface-border text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-all text-xs font-medium"
        >
          <Volume2 size={13} />
          Play pronunciation
        </button>
      </div>
    </div>
  );
}
