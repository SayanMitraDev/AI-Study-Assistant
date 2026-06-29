import { Router, type IRouter } from "express";
import { sql, eq } from "drizzle-orm";
import { db, decksTable, cardsTable, studySessionsTable, subjectsTable } from "@workspace/db";
import { GetDashboardStatsResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [[deckStats], [cardStats], [sessionStats], recentSessions, subjectBreakdown] = await Promise.all([
    db
      .select({ totalDecks: sql<number>`cast(count(*) as int)` })
      .from(decksTable),
    db
      .select({
        totalCards: sql<number>`cast(count(*) as int)`,
        masteredCards: sql<number>`cast(sum(case when ${cardsTable.mastered} then 1 else 0 end) as int)`,
      })
      .from(cardsTable),
    db
      .select({
        totalSessions: sql<number>`cast(count(*) as int)`,
        totalStudySeconds: sql<number>`cast(coalesce(sum(${studySessionsTable.durationSeconds}), 0) as int)`,
      })
      .from(studySessionsTable),
    db
      .select({
        id: studySessionsTable.id,
        deckId: studySessionsTable.deckId,
        deckName: decksTable.name,
        cardsReviewed: studySessionsTable.cardsReviewed,
        correctCount: studySessionsTable.correctCount,
        durationSeconds: studySessionsTable.durationSeconds,
        completedAt: studySessionsTable.completedAt,
      })
      .from(studySessionsTable)
      .leftJoin(decksTable, eq(decksTable.id, studySessionsTable.deckId))
      .orderBy(desc(studySessionsTable.completedAt))
      .limit(5),
    db
      .select({
        subjectId: decksTable.subjectId,
        subjectName: sql<string>`coalesce(${subjectsTable.name}, 'Uncategorized')`,
        deckCount: sql<number>`cast(count(distinct ${decksTable.id}) as int)`,
        cardCount: sql<number>`cast(count(${cardsTable.id}) as int)`,
        masteredCount: sql<number>`cast(sum(case when ${cardsTable.mastered} then 1 else 0 end) as int)`,
      })
      .from(decksTable)
      .leftJoin(subjectsTable, eq(subjectsTable.id, decksTable.subjectId))
      .leftJoin(cardsTable, eq(cardsTable.deckId, decksTable.id))
      .groupBy(decksTable.subjectId, subjectsTable.name),
  ]);

  const stats = {
    totalDecks: deckStats?.totalDecks ?? 0,
    totalCards: cardStats?.totalCards ?? 0,
    masteredCards: cardStats?.masteredCards ?? 0,
    totalSessions: sessionStats?.totalSessions ?? 0,
    totalStudyMinutes: Math.floor((sessionStats?.totalStudySeconds ?? 0) / 60),
    recentSessions: recentSessions.map((s) => ({
      ...s,
      deckName: s.deckName ?? "Unknown",
    })),
    subjectBreakdown: subjectBreakdown.map((s) => ({
      ...s,
      masteredCount: s.masteredCount ?? 0,
    })),
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

export default router;
