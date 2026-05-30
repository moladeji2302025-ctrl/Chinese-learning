import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "brand" | "gold" | "jade";
  className?: string;
}

const accentMap = {
  brand: {
    bg: "bg-brand-600/10",
    border: "border-brand-600/20",
    icon: "text-brand-400",
    value: "text-brand-300",
  },
  gold: {
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
    icon: "text-gold-400",
    value: "text-gold-300",
  },
  jade: {
    bg: "bg-jade-500/10",
    border: "border-jade-500/20",
    icon: "text-jade-400",
    value: "text-jade-300",
  },
};

export default function StatCard({ label, value, sub, icon: Icon, accent = "jade", className }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className={cn("card p-4", className)}>
      <div className={cn("inline-flex items-center justify-center w-9 h-9 rounded-xl border mb-3", a.bg, a.border)}>
        <Icon size={17} className={a.icon} />
      </div>
      <p className={cn("text-2xl font-bold", a.value)}>{value}</p>
      <p className="text-sm font-medium text-ink-primary mt-0.5">{label}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </div>
  );
}
