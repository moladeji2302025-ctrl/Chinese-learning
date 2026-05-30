import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Lock, CheckCircle, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const level = await prisma.level.findUnique({ where: { number: 1 } });
  if (!level) return <p className="text-ink-muted">No lessons found.</p>;

  const lessons = await prisma.lesson.findMany({
    where: { levelId: level.id },
    orderBy: { order: "asc" },
    include: {
      entries: {
        include: {
          entry: {
            include: { userProgress: { where: { userId }, take: 1 } },
          },
        },
      },
    },
  });

  const lessonStats = lessons.map((l) => {
    const total = l.entries.length;
    const learned = l.entries.filter((e) => (e.entry.userProgress[0]?.masteryLevel ?? 0) >= 1).length;
    const completed = learned >= total;
    const inProgress = learned > 0 && !completed;
    return { ...l, total, learned, completed, inProgress };
  });

  const totalWords = lessonStats.reduce((s, l) => s + l.total, 0);
  const learnedWords = lessonStats.reduce((s, l) => s + l.learned, 0);
  const completedCount = lessonStats.filter((l) => l.completed).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Level header */}
      <div className="card p-6 border-l-4 border-l-brand-600">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Level 1</span>
            <h1 className="text-2xl font-bold text-ink-primary mt-1">{level.title}</h1>
            <p className="text-sm text-ink-secondary mt-1">{level.description}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-3xl font-bold text-gold-400">
              {completedCount}<span className="text-lg text-ink-muted">/{lessons.length}</span>
            </p>
            <p className="text-xs text-ink-muted">lessons done</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-ink-muted mb-1.5">
            <span>{learnedWords} of {totalWords} words learned</span>
            <span>{totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all duration-700"
              style={{ width: `${totalWords > 0 ? (learnedWords / totalWords) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {lessonStats.map((lesson, idx) => {
          const prevCompleted = idx === 0 || lessonStats[idx - 1].completed;
          const locked = !prevCompleted && !lesson.inProgress && !lesson.completed;
          const pct = lesson.total > 0 ? Math.round((lesson.learned / lesson.total) * 100) : 0;

          if (locked) {
            return (
              <div key={lesson.id} className="card flex items-center gap-4 px-5 py-4 opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-3 border border-surface-border shrink-0">
                  <Lock size={16} className="text-ink-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink-muted">{lesson.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-surface-3 text-ink-muted">Locked</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 truncate">{lesson.scenario ?? lesson.description}</p>
                </div>
                <span className="text-xs text-ink-muted shrink-0">+{lesson.xpReward} XP</span>
              </div>
            );
          }

          return (
            <Link key={lesson.id} href={`/learn/${lesson.id}`} className="card flex items-center gap-4 px-5 py-4 hover:bg-surface-2 transition-all group block">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl border shrink-0 ${lesson.completed ? "bg-jade-500/15 border-jade-500/25" : lesson.inProgress ? "bg-brand-600/15 border-brand-600/25" : "bg-surface-2 border-surface-border"}`}>
                {lesson.completed
                  ? <CheckCircle size={18} className="text-jade-400" />
                  : lesson.inProgress
                  ? <BookOpen size={18} className="text-brand-400" />
                  : <span className="text-sm font-bold text-ink-muted">{lesson.order}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink-primary">{lesson.title}</span>
                  {lesson.completed && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-jade-500/15 text-jade-400 border border-jade-500/25">Complete</span>}
                  {lesson.inProgress && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600/15 text-brand-400 border border-brand-600/25">In Progress</span>}
                </div>
                <p className="text-xs text-ink-secondary mt-0.5 truncate">{lesson.scenario ?? lesson.description}</p>
                {lesson.learned > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-surface-3 overflow-hidden">
                      <div className={`h-full rounded-full ${lesson.completed ? "bg-jade-500" : "bg-brand-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-ink-muted">{lesson.learned}/{lesson.total}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-gold-400">
                  <Star size={11} className="fill-gold-400" />
                  <span className="font-medium">{lesson.xpReward}</span>
                </div>
                <ChevronRight size={16} className="text-ink-muted group-hover:text-ink-secondary transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card p-5 opacity-60 border-dashed text-center">
        <Lock size={20} className="text-ink-muted mx-auto mb-2" />
        <p className="text-sm font-semibold text-ink-secondary">Level 2 — Elementary</p>
        <p className="text-xs text-ink-muted mt-1">Complete Level 1 to unlock</p>
      </div>
    </div>
  );
}
