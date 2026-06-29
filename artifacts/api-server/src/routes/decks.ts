import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, decksTable, cardsTable } from "@workspace/db";
import {
  ListDecksQueryParams,
  CreateDeckBody,
  GetDeckParams,
  UpdateDeckParams,
  UpdateDeckBody,
  DeleteDeckParams,
  ListDecksResponse,
  CreateDeckResponse,
  GetDeckResponse,
  UpdateDeckResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getDeckWithCounts(id: number) {
  const [row] = await db
    .select({
      id: decksTable.id,
      subjectId: decksTable.subjectId,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: sql<number>`cast(count(${cardsTable.id}) as int)`,
      masteredCount: sql<number>`cast(sum(case when ${cardsTable.mastered} then 1 else 0 end) as int)`,
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(cardsTable.deckId, decksTable.id))
    .where(eq(decksTable.id, id))
    .groupBy(decksTable.id);
  return row;
}

router.get("/decks", async (req, res): Promise<void> => {
  const query = ListDecksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const rows = await db
    .select({
      id: decksTable.id,
      subjectId: decksTable.subjectId,
      name: decksTable.name,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      updatedAt: decksTable.updatedAt,
      cardCount: sql<number>`cast(count(${cardsTable.id}) as int)`,
      masteredCount: sql<number>`cast(sum(case when ${cardsTable.mastered} then 1 else 0 end) as int)`,
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(cardsTable.deckId, decksTable.id))
    .where(query.data.subjectId != null ? eq(decksTable.subjectId, query.data.subjectId) : undefined)
    .groupBy(decksTable.id)
    .orderBy(decksTable.createdAt);

  res.json(ListDecksResponse.parse(rows));
});

router.post("/decks", async (req, res): Promise<void> => {
  const parsed = CreateDeckBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [deck] = await db.insert(decksTable).values(parsed.data).returning();
  const withCounts = await getDeckWithCounts(deck.id);
  res.status(201).json(CreateDeckResponse.parse(withCounts));
});

router.get("/decks/:id", async (req, res): Promise<void> => {
  const params = GetDeckParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const deckWithCounts = await getDeckWithCounts(params.data.id);
  if (!deckWithCounts) {
    res.status(404).json({ error: "Deck not found" });
    return;
  }

  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, params.data.id))
    .orderBy(cardsTable.createdAt);

  res.json(GetDeckResponse.parse({ ...deckWithCounts, cards }));
});

router.patch("/decks/:id", async (req, res): Promise<void> => {
  const params = UpdateDeckParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateDeckBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [updated] = await db
    .update(decksTable)
    .set(body.data)
    .where(eq(decksTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Deck not found" });
    return;
  }
  const withCounts = await getDeckWithCounts(updated.id);
  res.json(UpdateDeckResponse.parse(withCounts));
});

router.delete("/decks/:id", async (req, res): Promise<void> => {
  const params = DeleteDeckParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(decksTable)
    .where(eq(decksTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Deck not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
