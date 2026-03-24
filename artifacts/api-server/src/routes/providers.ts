import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, providersTable } from "@workspace/db";
import { ListProvidersResponseItem } from "@workspace/api-zod";

const router = Router();

router.get("/providers", async (_req, res): Promise<void> => {
  const providers = await db
    .select()
    .from(providersTable)
    .where(eq(providersTable.isActive, true))
    .orderBy(providersTable.category, providersTable.name);

  res.json(providers.map(p => ListProvidersResponseItem.parse(p)));
});

export default router;
