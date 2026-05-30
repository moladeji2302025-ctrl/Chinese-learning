import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle, Target, Zap, ArrowRight, Lock, Play } from "lucide-react";
import Link from "next/link";
import XpBar from "@/components/ui/XpBar";
import StreakBadge from "@/components/ui/StreakBadge";
import WordOfDayCard from "@/components/ui/WordOfDayCard";
import StatCard from "@/components/ui/StatCard";

const XP_PER_LEVEL = 500;

async function getDashboardData(userId: string) {
  const [user, lessons, progressToday, totalProgress] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, currentLevel: true, xp: true, currentStreak: true },
    }),
    prisma.lesson.findMany({
      where: { level: { number: 1 } },
      orderBy: { order: "asc" },
      take: 4,
      include: {
        entries: {
          include: {
            entry: {
              include: { userProgress: { where: { userId }, take: 1 } },
            },
          },
        },
      },
    }),
    prisma.userProgress.count({
      where: {
        userId,
        lastReviewedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.userProgress.count({ where: { userId } }),
  ]);

  return { user, lessons, progressToday, totalProgress };
}

async function getWordOfDay(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.wordOfDayLog.findFirst({
    where: { userId, servedAt: { gte: today } },
    include: { entry: { include: { examples: { take: 1 } } } },
  });

  if (existing) return existing.entry;

  const word = await prisma.dictionaryEntry.findFirst({
    where: { hskLevel: 1 },
    include: { examples: { take: 1 } },
    skip: Math.floor(Math.random() * 30),
  });

  if (word) {
    await prisma.wordOfDayLog.create({
      data: { userId, dictionaryEntryId: word.id, servedAt: new Date() },
    });
  }

  return word;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [{ user, lessons, progressToday, totalProgress }, wordOfDay] =
    await Promise.all([
      getDashboardData(session.user.id),
      getWordOfDay(session.user.id),
    ]);

  if (!user) redirect("/login");

  const levelXp = user.xp % XP_PER_LEVEL;

  // Find the first incomplete lesson
  const currentLesson = lessons.find((l) => {
    const learned = l.entries.filter((e) => (e.entry.userProgress[0]?.masteryLevel ?? 0) >= 1).length;
    return learned < l.entries.length;
  }) ?? lessons[0];

  const currentLessonLearned = currentLesson
    ? currentLesson.entries.filter((e) => (e.entry.userProgress[0]?.masteryLevel ?? 0) >= 1).length
    : 0;

  const upcomingLessons = lessons.slice(1, 4).map((l, i) => ({
    id: l.id,
    title: l.title,
    locked: i > 0 && lessons[i].entries.filter((e) => (e.entry.userProgress[0]?.masteryLevel ?? 0) >= 1).length < lessons[i].entries.length * 0.7,
  }));

  const accuracyRecords = await prisma.userProgress.findMany({
    where: { userId: session.user.id, lastReviewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    select: { masteryLevel: true },
  });
  const accuracy = accuracyRecords.length > 0
    ? Math.round((accuracyRecords.filter((p) => p.masteryLevel >= 3).length / accuracyRecords.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* XP Progress Banner */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500/15 text-gold-400 border border-gold-500/25">
                Level {user.currentLevel} — Beginner
              </span>
              <StreakBadge streak={user.currentStreak} size="sm" />
            </div>
            <XpBar xp={levelXp} maxXp={XP_PER_LEVEL} level={user.currentLevel} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Continue Lesson */}
          {currentLesson && (
            <div className="card p-5 border-l-4 border-l-brand-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">Continue Learning</p>
              <h2 className="text-lg font-bold text-ink-primary mb-1">{currentLesson.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500"
                    style={{ width: `${(currentLessonLearned / currentLesson.entries.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-ink-secondary whitespace-nowrap">
                  {currentLessonLearned}/{currentLesson.entries.length} words
                </span>
              </div>
              <Link
                href={`/learn/${currentLesson.id}/study`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all glow-brand hover:shadow-none"
              >
                <Play size={15} className="fill-white" />
                {currentLessonLearned > 0 ? "Continue Lesson" : "Start Lesson"}
              </Link>
            </div>
          )}

          {/* Upcoming lessons */}
          <div>
            <h3 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-3 px-1">Upcoming Lessons</h3>
            <div className="space-y-2">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="card flex items-center gap-4 px-4 py-3.5 hover:bg-surface-2 transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-2 border border-surface-border shrink-0">
                    {lesson.locked ? <Lock size={14} className="text-ink-muted" /> : <BookOpen size={14} className="text-jade-400" />}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${lesson.locked ? "text-ink-muted" : "text-ink-primary"}`}>{lesson.title}</span>
                  {lesson.locked
                    ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-3 text-ink-muted">Locked</span>
                    : <ArrowRight size={14} className="text-ink-muted group-hover:text-ink-secondary transition-colors" />}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Words Learned" value={totalProgress} sub="total all time" icon={BookOpen} accent="jade" />
            <StatCard label="Accuracy" value={`${accuracy}%`} sub="this week" icon={Target} accent="brand" />
            <StatCard label="Today" value={progressToday} sub="cards reviewed" icon={Zap} accent="gold" />
            <StatCard label="Streak" value={`${user.currentStreak}d`} sub="keep it up!" icon={CheckCircle} accent="jade" />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {wordOfDay ? (
            <WordOfDayCard
              character={wordOfDay.simplified}
              pinyin={wordOfDay.pinyin}
              meaning={wordOfDay.meanings[0] ?? ""}
              example={wordOfDay.examples[0]?.simplified ?? ""}
              exampleTranslation={wordOfDay.examples[0]?.translation ?? ""}
              hskLevel={wordOfDay.hskLevel}
            />
          ) : null}

          {/* Quick Practice */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-primary mb-3">Quick Practice</h3>
            <div className="space-y-2">
              {[
                { label: "Flashcard Review", desc: "Continue learning", accent: "text-jade-400", href: currentLesson ? `/learn/${currentLesson.id}/study` : "/learn" },
                { label: "Browse Dictionary", desc: "All 100 words", accent: "text-gold-400", href: "/dictionary" },
                { label: "All Lessons", desc: "Level overview", accent: "text-brand-400", href: "/learn" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-2 border border-surface-border hover:bg-surface-3 transition-all group text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{item.label}</p>
                    <p className={`text-xs ${item.accent}`}>{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-ink-muted group-hover:text-ink-secondary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink-primary">Daily Goal</h3>
              <span className="text-xs text-jade-400 font-medium">{progressToday}/20 cards</span>
            </div>
            <div className="h-2 rounded-full bg-surface-3 overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-jade-600 to-jade-400" style={{ width: `${Math.min(100, (progressToday / 20) * 100)}%` }} />
            </div>
            <p className="text-xs text-ink-muted">
              {progressToday >= 20 ? "Goal complete! Great work today." : `${20 - progressToday} more cards to hit your daily goal`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
