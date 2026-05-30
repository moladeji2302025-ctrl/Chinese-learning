"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  Library,
  Trophy,
  Settings,
  ChevronRight,
  Flame,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: PenLine },
  { href: "/dictionary", label: "Dictionary", icon: Library },
  { href: "/achievements", label: "Achievements", icon: Trophy },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userLevel?: number;
  xp?: number;
  maxXp?: number;
  streak?: number;
}

export default function Sidebar({ userLevel = 1, xp = 0, maxXp = 500, streak = 0 }: SidebarProps) {
  const pathname = usePathname();
  const xpPct = Math.min(100, Math.round((xp / maxXp) * 100));

  return (
    <aside className="flex flex-col w-64 h-full bg-surface-1 border-r border-surface-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 glow-brand text-white font-bold text-lg select-none">
          汉
        </div>
        <div>
          <span className="font-bold text-ink-primary text-base tracking-tight">HanziHero</span>
          <p className="text-[10px] text-ink-muted uppercase tracking-widest">Learn Chinese</p>
        </div>
      </div>

      {/* User level + XP mini bar */}
      <div className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-surface-2 border border-surface-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-ink-secondary">Level</span>
            <span className="text-sm font-bold text-gold-400">{userLevel}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ink-secondary">
            <Zap size={11} className="text-gold-400" />
            <span className="font-medium">{xp.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-ink-muted text-right">{maxXp - xp} XP to Level {userLevel + 1}</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-600/15 text-brand-400 border border-brand-600/25"
                  : "text-ink-secondary hover:bg-surface-2 hover:text-ink-primary"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-brand-500" : "text-ink-muted group-hover:text-ink-secondary"
                )}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-brand-500 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Streak pill */}
      {streak > 0 && (
        <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-surface-border">
          <Flame size={16} className="text-orange-400" />
          <span className="text-sm font-semibold text-ink-primary">{streak}</span>
          <span className="text-xs text-ink-secondary">day streak</span>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-3 pb-4 border-t border-surface-border pt-3 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-surface-2 text-ink-primary"
                  : "text-ink-secondary hover:bg-surface-2 hover:text-ink-primary"
              )}
            >
              <Icon size={18} className="shrink-0 text-ink-muted group-hover:text-ink-secondary" />
              {label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
