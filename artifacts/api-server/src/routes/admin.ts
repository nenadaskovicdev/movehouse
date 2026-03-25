import { Router } from "express";
import { eq, count, sql, ilike, or, desc } from "drizzle-orm";
import { db, usersTable, movesTable, moveProvidersTable, providersTable, settingsTable } from "@workspace/db";
import { z } from "zod";

const router = Router();

const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!req.session.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [movesStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${movesTable.status} = 'active')`,
      completed: sql<number>`count(*) filter (where ${movesTable.status} = 'completed')`,
    })
    .from(movesTable);

  const [usersStats] = await db.select({ total: count() }).from(usersTable);
  const [providersStats] = await db.select({ total: count() }).from(providersTable);

  const [submissionsStats] = await db
    .select({
      pending: sql<number>`count(*) filter (where ${moveProvidersTable.status} = 'pending')`,
      actionRequired: sql<number>`count(*) filter (where ${moveProvidersTable.status} = 'action_required')`,
    })
    .from(moveProvidersTable);

  res.json({
    totalMoves: Number(movesStats.total),
    activeMoves: Number(movesStats.active),
    completedMoves: Number(movesStats.completed),
    totalUsers: Number(usersStats.total),
    totalProviders: Number(providersStats.total),
    pendingSubmissions: Number(submissionsStats.pending),
    actionRequired: Number(submissionsStats.actionRequired),
  });
});

router.get("/admin/cases", requireAdmin, async (req, res): Promise<void> => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const statusFilter = typeof req.query.status === "string" ? req.query.status : undefined;

  const providerCounts = db
    .select({
      moveId: moveProvidersTable.moveId,
      providerCount: count().as("providerCount"),
      pendingCount: sql<number>`count(*) filter (where ${moveProvidersTable.status} = 'pending')`.as("pendingCount"),
    })
    .from(moveProvidersTable)
    .groupBy(moveProvidersTable.moveId)
    .as("pc");

  let query = db
    .select({
      id: movesTable.id,
      userId: movesTable.userId,
      userEmail: usersTable.email,
      userFullName: usersTable.fullName,
      oldAddressLine1: movesTable.oldAddressLine1,
      oldCity: movesTable.oldCity,
      oldPostcode: movesTable.oldPostcode,
      newAddressLine1: movesTable.newAddressLine1,
      newCity: movesTable.newCity,
      newPostcode: movesTable.newPostcode,
      moveDate: movesTable.moveDate,
      status: movesTable.status,
      createdAt: movesTable.createdAt,
      updatedAt: movesTable.updatedAt,
      providerCount: sql<number>`coalesce(${providerCounts.providerCount}, 0)`,
      pendingCount: sql<number>`coalesce(${providerCounts.pendingCount}, 0)`,
    })
    .from(movesTable)
    .innerJoin(usersTable, eq(movesTable.userId, usersTable.id))
    .leftJoin(providerCounts, eq(movesTable.id, providerCounts.moveId))
    .orderBy(desc(movesTable.createdAt))
    .$dynamic();

  if (search) {
    query = query.where(
      or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.fullName, `%${search}%`),
        ilike(movesTable.oldPostcode, `%${search}%`),
        ilike(movesTable.newPostcode, `%${search}%`),
      )
    );
  }

  if (statusFilter) {
    query = query.where(eq(movesTable.status, statusFilter));
  }

  const rows = await query;
  res.json(rows);
});

router.get("/admin/cases/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [move] = await db
    .select({
      id: movesTable.id,
      userId: movesTable.userId,
      userEmail: usersTable.email,
      userFullName: usersTable.fullName,
      isTestUser: usersTable.isTestUser,
      oldAddressLine1: movesTable.oldAddressLine1,
      oldAddressLine2: movesTable.oldAddressLine2,
      oldCity: movesTable.oldCity,
      oldPostcode: movesTable.oldPostcode,
      newAddressLine1: movesTable.newAddressLine1,
      newAddressLine2: movesTable.newAddressLine2,
      newCity: movesTable.newCity,
      newPostcode: movesTable.newPostcode,
      moveDate: movesTable.moveDate,
      status: movesTable.status,
      createdAt: movesTable.createdAt,
      updatedAt: movesTable.updatedAt,
    })
    .from(movesTable)
    .innerJoin(usersTable, eq(movesTable.userId, usersTable.id))
    .where(eq(movesTable.id, id));

  if (!move) {
    res.status(404).json({ error: "Case not found" });
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

  res.json({ ...move, providers: moveProviders });
});

router.get("/admin/providers", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(providersTable).orderBy(providersTable.category, providersTable.name);
  res.json(rows);
});

const AdminUpdateProviderBody = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  isAffiliate: z.boolean().optional(),
  affiliateUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

router.patch("/admin/providers/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = AdminUpdateProviderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates = parsed.data;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(providersTable)
    .set(updates)
    .where(eq(providersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Provider not found" });
    return;
  }

  res.json(updated);
});

router.get("/admin/settings", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(settingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json({
    testPreviewEmail: settings["test_preview_email"] ?? "",
  });
});

const AdminUpdateSettingsBody = z.object({
  testPreviewEmail: z.string().email().or(z.literal("")),
});

router.put("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminUpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db
    .insert(settingsTable)
    .values({ key: "test_preview_email", value: parsed.data.testPreviewEmail })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value: parsed.data.testPreviewEmail } });

  res.json({ testPreviewEmail: parsed.data.testPreviewEmail });
});

const AdminToggleTestUserBody = z.object({
  isTestUser: z.boolean(),
});

router.patch("/admin/users/:id/test", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = AdminToggleTestUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set({ isTestUser: parsed.data.isTestUser })
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id, isTestUser: usersTable.isTestUser, email: usersTable.email });

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(updated);
});

export default router;
