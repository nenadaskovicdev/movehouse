import { pgTable, serial, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const movesTable = pgTable("moves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  oldAddressLine1: text("old_address_line1").notNull(),
  oldAddressLine2: text("old_address_line2"),
  oldCity: text("old_city").notNull(),
  oldPostcode: text("old_postcode").notNull(),
  newAddressLine1: text("new_address_line1").notNull(),
  newAddressLine2: text("new_address_line2"),
  newCity: text("new_city").notNull(),
  newPostcode: text("new_postcode").notNull(),
  moveDate: date("move_date").notNull(),
  status: text("status").notNull().default("active"), // active | completed | cancelled
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMoveSchema = createInsertSchema(movesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMove = z.infer<typeof insertMoveSchema>;
export type Move = typeof movesTable.$inferSelect;
