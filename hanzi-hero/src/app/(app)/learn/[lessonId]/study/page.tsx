import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StudyClient from "./StudyClient";
import type { StudyWord } from "./StudyClient";

export default async function StudyPage({ params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      entries: {
        orderBy: { order: "asc" },
        include: {
          entry: {
            include: {
              examples: { take: 1 },
              userProgress: { where: { userId }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const words: StudyWord[] = lesson.entries.map(({ entry }) => ({
    id: entry.id,
    simplified: entry.simplified,
    pinyin: entry.pinyin,
    meanings: entry.meanings,
    example: entry.examples[0]?.simplified ?? "",
    exampleTranslation: entry.examples[0]?.translation ?? "",
    hskLevel: entry.hskLevel,
    masteryLevel: entry.userProgress[0]?.masteryLevel ?? 0,
  }));

  return <StudyClient lessonId={params.lessonId} words={words} />;
}
