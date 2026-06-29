import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, cardsTable } from "@workspace/db";
import {
  ListCardsParams,
  CreateCardParams,
  CreateCardBody,
  UpdateCardParams,
  UpdateCardBody,
  DeleteCardParams,
  ListCardsResponse,
  CreateCardResponse,
  UpdateCardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/decks/:deckId/cards", async (req, res): Promise<void> => {
  const params = ListCardsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, params.data.deckId))
    .orderBy(cardsTable.createdAt);
  res.json(ListCardsResponse.parse(cards));
});

router.post("/decks/:deckId/cards", async (req, res): Promise<void> => {
  const params = CreateCardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateCardBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [card] = await db
    .insert(cardsTable)
    .values({ deckId: params.data.deckId, ...body.data })
    .returning();
  res.status(201).json(CreateCardResponse.parse(card));
});

router.patch("/cards/:id", async (req, res): Promise<void> => {
  const params = UpdateCardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateCardBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [card] = await db
    .update(cardsTable)
    .set(body.data)
    .where(eq(cardsTable.id, params.data.id))
    .returning();
  if (!card) {
    res.status(404).json({ error: "Card not found" });
    return;
  }
  res.json(UpdateCardResponse.parse(card));
});

router.delete("/cards/:id", async (req, res): Promise<void> => {
  const params = DeleteCardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(cardsTable)
    .where(eq(cardsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Card not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
