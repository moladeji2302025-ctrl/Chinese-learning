import { Bell, Search } from "lucide-react";

interface HeaderProps {
  userName?: string;
  streak?: number;
}

export default function Header({ userName = "Learner", streak = 0 }: HeaderProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-1/50 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-ink-primary">
          {greeting},{" "}
          <span className="gradient-brand">{userName}</span> 👋
        </h1>
        <p className="text-xs text-ink-secondary mt-0.5">
          {streak > 0
            ? `${streak}-day streak — keep it going!`
            : "Start learning to build your streak!"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-surface-border text-ink-muted hover:text-ink-secondary hover:bg-surface-3 transition-all text-sm"
        >
          <Search size={15} />
          <span className="hidden sm:inline text-xs">Search…</span>
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-ink-muted font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-surface-2 border border-surface-border text-ink-muted hover:text-ink-secondary hover:bg-surface-3 transition-all"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-500 ring-2 ring-surface-1" />
        </button>

        {/* Avatar */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white font-bold text-sm select-none cursor-pointer hover:bg-brand-700 transition-colors">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
