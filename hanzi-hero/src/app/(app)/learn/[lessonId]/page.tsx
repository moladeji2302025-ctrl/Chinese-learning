import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, PenLine, Volume2, Star, Play, Clock } from "lucide-react";

const masteryLabel = ["New", "Seen", "Familiar", "Practiced", "Strong", "Mastered"];
const masteryColor = [
  "bg-surface-3 text-ink-muted",
  "bg-blue-500/15 text-blue-400",
  "bg-gold-500/15 text-gold-400",
  "bg-orange-500/15 text-orange-400",
  "bg-jade-500/15 text-jade-400",
  "bg-jade-600/20 text-jade-300",
];

export default async function LessonDetailPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      level: true,
      entries: {
        orderBy: { order: "asc" },
        include: {
          entry: {
            include: {
              userProgress: { where: { userId }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const total = lesson.entries.length;
  const learned = lesson.entries.filter((e) => (e.entry.userProgress[0]?.masteryLevel ?? 0) >= 1).length;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink-primary transition-colors">
        <ArrowLeft size={15} />
        Back to lessons
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Lesson {lesson.order}</span>
              <div className="flex items-center gap-1 text-xs text-gold-400">
                <Star size={11} className="fill-gold-400" />
                <span className="font-medium">+{lesson.xpReward} XP</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-ink-primary">{lesson.title}</h1>
            <p className="text-sm text-ink-secondary mt-1">{lesson.description}</p>
          </div>
        </div>

        {lesson.scenario && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-surface-2 border border-surface-border">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">Scenario</p>
            <p className="text-sm text-ink-secondary">{lesson.scenario}</p>
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between text-xs text-ink-muted mb-1.5">
            <span>{learned} of {total} words learned</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Study modes */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: `/learn/${lesson.id}/study`, icon: BookOpen, label: "Flashcards", desc: "Learn & review", accent: "text-brand-400", bg: "bg-brand-600/10 border-brand-600/20 hover:bg-brand-600/20" },
          { href: `/learn/${lesson.id}/write`, icon: PenLine, label: "Write", desc: "Stroke order", accent: "text-gold-400", bg: "bg-gold-500/10 border-gold-500/20 hover:bg-gold-500/20" },
          { href: `/learn/${lesson.id}/listen`, icon: Volume2, label: "Listen", desc: "Pronunciation", accent: "text-jade-400", bg: "bg-jade-500/10 border-jade-500/20 hover:bg-jade-500/20" },
        ].map(({ href, icon: Icon, label, desc, accent, bg }) => (
          <Link key={href} href={href} className={`card flex flex-col items-center gap-2 px-3 py-4 border text-center transition-all ${bg}`}>
            <Icon size={20} className={accent} />
            <div>
              <p className="text-sm font-semibold text-ink-primary">{label}</p>
              <p className="text-xs text-ink-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/learn/${lesson.id}/study`}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all glow-brand hover:shadow-none"
      >
        <Play size={16} className="fill-white" />
        {learned > 0 ? "Continue Lesson" : "Start Lesson"}
      </Link>

      {/* Word list */}
      <div>
        <h2 className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-3 px-1">Words in this lesson</h2>
        <div className="space-y-2">
          {lesson.entries.map(({ entry }) => {
            const mastery = entry.userProgress[0]?.masteryLevel ?? 0;
            return (
              <div key={entry.id} className="card flex items-center gap-4 px-4 py-3">
                <div className="w-12 text-center">
                  <span className="text-2xl font-bold text-ink-primary">{entry.simplified}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-400">{entry.pinyin}</p>
                  <p className="text-xs text-ink-secondary truncate">{entry.meanings[0]}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${masteryColor[mastery]}`}>
                  {masteryLabel[mastery]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-ink-muted pb-4">
        <Clock size={12} />
        <span>~{total * 2} minutes to complete this lesson</span>
      </div>
    </div>
  );
}
