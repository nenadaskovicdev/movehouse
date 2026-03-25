import { Router } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, movesTable, moveProvidersTable, providersTable, usersTable, settingsTable } from "@workspace/db";
import {
  CreateMoveBody,
  ListMovesResponseItem,
  GetMoveResponse,
  UpdateMoveProviderBody,
  UpdateMoveProviderResponse,
} from "@workspace/api-zod";
import { sendTestMovePreview } from "../lib/email";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
};

router.get("/moves", requireAuth, async (req, res): Promise<void> => {
  const moves = await db
    .select()
    .from(movesTable)
    .where(eq(movesTable.userId, req.session.userId!))
    .orderBy(movesTable.createdAt);

  res.json(moves.map(m => ListMovesResponseItem.parse(m)));
});

router.post("/moves", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateMoveBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { providerIds, ...moveData } = parsed.data;

  const [move] = await db
    .insert(movesTable)
    .values({ ...moveData, userId: req.session.userId! })
    .returning();

  let selectedProviders: Array<{ name: string; category: string }> = [];

  if (providerIds && providerIds.length > 0) {
    await db.insert(moveProvidersTable).values(
      providerIds.map((providerId) => ({
        moveId: move.id,
        providerId,
        status: "pending" as const,
      }))
    );

    selectedProviders = await db
      .select({ id: providersTable.id, name: providersTable.name, category: providersTable.category })
      .from(providersTable)
      .where(inArray(providersTable.id, providerIds));
  }

  const [user] = await db
    .select({ isTestUser: usersTable.isTestUser, email: usersTable.email, fullName: usersTable.fullName })
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId!));

  if (user?.isTestUser) {
    const settingRows = await db.select().from(settingsTable).where(eq(settingsTable.key, "test_preview_email"));
    const toEmail = settingRows[0]?.value;

    if (toEmail) {
      const oldAddress = [move.oldAddressLine1, move.oldAddressLine2, move.oldCity, move.oldPostcode]
        .filter(Boolean).join(", ");
      const newAddress = [move.newAddressLine1, move.newAddressLine2, move.newCity, move.newPostcode]
        .filter(Boolean).join(", ");

      sendTestMovePreview(toEmail, {
        userName: user.fullName,
        userEmail: user.email,
        oldAddress,
        newAddress,
        moveDate: move.moveDate,
        providers: selectedProviders,
      }).catch(() => {});
    }
  }

  res.status(201).json(ListMovesResponseItem.parse(move));
});

router.get("/moves/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid move id" });
    return;
  }

  const [move] = await db
    .select()
    .from(movesTable)
    .where(and(eq(movesTable.id, id), eq(movesTable.userId, req.session.userId!)));

  if (!move) {
    res.status(404).json({ error: "Move not found" });
    return;
  }

  const moveProviders = await db
    .select({
      id: moveProvidersTable.id,
      moveId: moveProvidersTable.moveId,
      providerId: moveProvidersTable.providerId,
      status: moveProvidersTable.status,
      notes: moveProvidersTable.notes,
      updatedAt: moveProvidersTable.updatedAt,
      createdAt: moveProvidersTable.createdAt,
      providerName: providersTable.name,
      providerCategory: providersTable.category,
      isAffiliate: providersTable.isAffiliate,
      affiliateUrl: providersTable.affiliateUrl,
    })
    .from(moveProvidersTable)
    .innerJoin(providersTable, eq(moveProvidersTable.providerId, providersTable.id))
    .where(eq(moveProvidersTable.moveId, id));

  const detail = GetMoveResponse.parse({ ...move, providers: moveProviders });
  res.json(detail);
});

router.patch("/moves/:id/providers/:providerId", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawProviderId = Array.isArray(req.params.providerId) ? req.params.providerId[0] : req.params.providerId;
  const moveId = parseInt(rawId, 10);
  const providerId = parseInt(rawProviderId, 10);

  if (isNaN(moveId) || isNaN(providerId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateMoveProviderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [move] = await db
    .select({ id: movesTable.id })
    .from(movesTable)
    .where(and(eq(movesTable.id, moveId), eq(movesTable.userId, req.session.userId!)));

  if (!move) {
    res.status(404).json({ error: "Move not found" });
    return;
  }

  const [updated] = await db
    .update(moveProvidersTable)
    .set({ status: parsed.data.status, notes: parsed.data.notes ?? null })
    .where(
      and(
        eq(moveProvidersTable.moveId, moveId),
        eq(moveProvidersTable.providerId, providerId)
      )
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Provider not found on this move" });
    return;
  }

  const [providerRow] = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.id, providerId));

  res.json(UpdateMoveProviderResponse.parse({
    ...updated,
    providerName: providerRow.name,
    providerCategory: providerRow.category,
    isAffiliate: providerRow.isAffiliate,
    affiliateUrl: providerRow.affiliateUrl ?? null,
  }));
});

export default router;
