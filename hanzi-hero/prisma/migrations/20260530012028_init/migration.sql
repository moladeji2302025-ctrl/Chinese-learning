-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "passwordHash" TEXT,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xpRequired" INTEGER NOT NULL,
    "hskRange" INTEGER[],

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scenario" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonEntry" (
    "lessonId" TEXT NOT NULL,
    "dictionaryEntryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LessonEntry_pkey" PRIMARY KEY ("lessonId","dictionaryEntryId")
);

-- CreateTable
CREATE TABLE "DictionaryEntry" (
    "id" TEXT NOT NULL,
    "simplified" TEXT NOT NULL,
    "traditional" TEXT,
    "pinyin" TEXT NOT NULL,
    "pinyinTones" TEXT NOT NULL,
    "meanings" TEXT[],
    "hskLevel" INTEGER NOT NULL,
    "strokeData" JSONB,
    "audioUrl" TEXT,

    CONSTRAINT "DictionaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "dictionaryEntryId" TEXT NOT NULL,
    "simplified" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "audioUrl" TEXT,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dictionaryEntryId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "masteryLevel" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "passMark" INTEGER NOT NULL DEFAULT 80,
    "attempts" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "attemptNum" INTEGER NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordOfDayLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dictionaryEntryId" TEXT NOT NULL,
    "servedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordOfDayLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wordsLearned" INTEGER NOT NULL DEFAULT 0,
    "wordsReviewed" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "streakDay" INTEGER NOT NULL DEFAULT 0,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Level_number_key" ON "Level"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_levelId_order_key" ON "Lesson"("levelId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryEntry_simplified_key" ON "DictionaryEntry"("simplified");

-- CreateIndex
CREATE INDEX "DictionaryEntry_hskLevel_idx" ON "DictionaryEntry"("hskLevel");

-- CreateIndex
CREATE INDEX "DictionaryEntry_simplified_idx" ON "DictionaryEntry"("simplified");

-- CreateIndex
CREATE INDEX "UserProgress_userId_nextReviewDate_idx" ON "UserProgress"("userId", "nextReviewDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_dictionaryEntryId_key" ON "UserProgress"("userId", "dictionaryEntryId");

-- CreateIndex
CREATE INDEX "ExamResult_userId_examId_idx" ON "ExamResult"("userId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "WordOfDayLog_userId_servedAt_key" ON "WordOfDayLog"("userId", "servedAt");

-- CreateIndex
CREATE INDEX "DailyReport_userId_date_idx" ON "DailyReport"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_userId_date_key" ON "DailyReport"("userId", "date");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonEntry" ADD CONSTRAINT "LessonEntry_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonEntry" ADD CONSTRAINT "LessonEntry_dictionaryEntryId_fkey" FOREIGN KEY ("dictionaryEntryId") REFERENCES "DictionaryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_dictionaryEntryId_fkey" FOREIGN KEY ("dictionaryEntryId") REFERENCES "DictionaryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_dictionaryEntryId_fkey" FOREIGN KEY ("dictionaryEntryId") REFERENCES "DictionaryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordOfDayLog" ADD CONSTRAINT "WordOfDayLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordOfDayLog" ADD CONSTRAINT "WordOfDayLog_dictionaryEntryId_fkey" FOREIGN KEY ("dictionaryEntryId") REFERENCES "DictionaryEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
