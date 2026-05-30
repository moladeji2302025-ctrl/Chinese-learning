export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  masteryLevel: number;
}

/**
 * SM-2 spaced repetition algorithm.
 * quality 4 = "Got it", quality 1 = "Needs work"
 */
export function sm2(
  quality: number,
  easeFactor: number,
  interval: number,
  repetitions: number,
): SM2Result {
  const correct = quality >= 3;

  let newInterval: number;
  let newRepetitions: number;

  if (!correct) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * easeFactor);
    newRepetitions = repetitions + 1;
  }

  const newEaseFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );

  const nextReviewDate = new Date(
    Date.now() + newInterval * 24 * 60 * 60 * 1000,
  );

  const masteryLevel = Math.min(5, newRepetitions);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
    masteryLevel,
  };
}
