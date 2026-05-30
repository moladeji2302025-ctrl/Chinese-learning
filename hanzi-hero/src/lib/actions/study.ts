"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sm2 } from "@/lib/sm2";
import { revalidatePath } from "next/cache";

export async function submitCardResult(wordId: string, correct: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const quality = correct ? 4 : 1;

  const existing = await prisma.userProgress.findUnique({
    where: { userId_dictionaryEntryId: { userId, dictionaryEntryId: wordId } },
  });

  const result = sm2(
    quality,
    existing?.easeFactor ?? 2.5,
    existing?.interval ?? 0,
    existing?.repetitions ?? 0,
  );

  await prisma.userProgress.upsert({
    where: { userId_dictionaryEntryId: { userId, dictionaryEntryId: wordId } },
    update: {
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      nextReviewDate: result.nextReviewDate,
      masteryLevel: result.masteryLevel,
      lastReviewedAt: new Date(),
    },
    create: {
      userId,
      dictionaryEntryId: wordId,
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      nextReviewDate: result.nextReviewDate,
      masteryLevel: result.masteryLevel,
      lastReviewedAt: new Date(),
    },
  });

  // Award XP: +2 per correct card, +1 for attempting
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: { increment: correct ? 2 : 1 },
      totalXp: { increment: correct ? 2 : 1 },
      lastActiveDate: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/learn");

  return { masteryLevel: result.masteryLevel, nextReviewDate: result.nextReviewDate };
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, currentStreak: true, longestStreak: true },
  });

  if (!user) return;

  const now = new Date();
  const last = user.lastActiveDate;
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = user.currentStreak;
  if (diffDays === 1) newStreak += 1;
  else if (diffDays > 1) newStreak = 1;

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastActiveDate: now,
    },
  });
}
