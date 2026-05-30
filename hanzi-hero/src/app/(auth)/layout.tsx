export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 bg-surface-0">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 glow-brand text-white font-bold text-2xl select-none">
            汉
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-ink-primary tracking-tight">HanziHero</p>
            <p className="text-xs text-ink-muted uppercase tracking-widest">Learn Chinese</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
