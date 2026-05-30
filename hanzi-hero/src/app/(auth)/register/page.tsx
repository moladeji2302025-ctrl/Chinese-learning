"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const pw = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (pw !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await registerUser(fd);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, registerUser calls signIn which redirects automatically
  }

  return (
    <div className="card p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink-primary">Start your journey</h1>
        <p className="text-sm text-ink-secondary mt-1">Create a free account and learn Chinese today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-surface-border text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-surface-border text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-surface-2 border border-surface-border text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm" className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            id="confirm"
            name="confirm"
            type={showPw ? "text" : "password"}
            required
            placeholder="Repeat password"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-surface-border text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-brand-400 bg-brand-600/10 border border-brand-600/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all glow-brand hover:shadow-none"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account…" : "Create free account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
