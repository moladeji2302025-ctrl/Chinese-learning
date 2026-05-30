import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { icon: 14, text: "text-sm", container: "px-2.5 py-1", gap: "gap-1" },
  md: { icon: 18, text: "text-base", container: "px-3.5 py-1.5", gap: "gap-1.5" },
  lg: { icon: 24, text: "text-xl", container: "px-5 py-2.5", gap: "gap-2" },
};

export default function StreakBadge({ streak, size = "md", className }: StreakBadgeProps) {
  const s = sizeMap[size];
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-2xl border font-bold transition-all",
        s.container,
        s.gap,
        isOnFire
          ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
          : isHot
          ? "bg-orange-600/10 border-orange-600/20 text-orange-400"
          : "bg-surface-2 border-surface-border text-ink-secondary",
        className
      )}
    >
      <Flame
        size={s.icon}
        className={cn(
          isOnFire ? "text-orange-300 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" :
          isHot ? "text-orange-400" : "text-ink-muted"
        )}
      />
      <span className={s.text}>{streak}</span>
      {size !== "sm" && (
        <span className="text-[11px] font-medium opacity-70 ml-0.5">
          {streak === 1 ? "day" : "days"}
        </span>
      )}
    </div>
  );
}
