"use client";

import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface XpBarProps {
  xp: number;
  maxXp: number;
  level: number;
  className?: string;
}

export default function XpBar({ xp, maxXp, level, className }: XpBarProps) {
  const pct = Math.min(100, Math.round((xp / maxXp) * 100));
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const to = pct;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [pct]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-gold-400" />
          <span className="text-sm font-semibold text-ink-primary">
            {xp.toLocaleString()} XP
          </span>
        </div>
        <span className="text-xs text-ink-secondary">
          {(maxXp - xp).toLocaleString()} to Level {level + 1}
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-surface-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 transition-none"
          style={{ width: `${displayed}%` }}
        />
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-ink-muted">Level {level}</span>
        <span className="text-[10px] text-ink-muted font-medium">{displayed}%</span>
        <span className="text-[10px] text-ink-muted">Level {level + 1}</span>
      </div>
    </div>
  );
}
