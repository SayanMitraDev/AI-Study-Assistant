import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, studySessionsTable, decksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateStudySessionBody,
  ListStudySessionsResponse,
  CreateStudySessionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/study-sessions", async (_req, res): Promise<void> => {
  const rows = await db
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
    .limit(20);

  res.json(ListStudySessionsResponse.parse(rows));
});

router.post("/study-sessions", async (req, res): Promise<void> => {
  const parsed = CreateStudySessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db
    .insert(studySessionsTable)
    .values(parsed.data)
    .returning();

  const [deck] = await db
    .select({ name: decksTable.name })
    .from(decksTable)
    .where(eq(decksTable.id, session.deckId));

  res.status(201).json(
    CreateStudySessionResponse.parse({
      ...session,
      deckName: deck?.name ?? "Unknown",
    })
  );
});

export default router;
