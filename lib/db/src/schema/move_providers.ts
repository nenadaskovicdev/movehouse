import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { movesTable } from "./moves";
import { providersTable } from "./providers";

export const moveProvidersTable = pgTable("move_providers", {
  id: serial("id").primaryKey(),
  moveId: integer("move_id").notNull().references(() => movesTable.id),
  providerId: integer("provider_id").notNull().references(() => providersTable.id),
  status: text("status").notNull().default("pending"), // pending | submitted | completed | failed | action_required
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMoveProviderSchema = createInsertSchema(moveProvidersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMoveProvider = z.infer<typeof insertMoveProviderSchema>;
export type MoveProvider = typeof moveProvidersTable.$inferSelect;
