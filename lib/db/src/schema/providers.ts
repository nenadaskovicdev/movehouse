import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const providersTable = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // council | energy | water | broadband | mobile | tv | postal
  description: text("description"),
  isAffiliate: boolean("is_affiliate").notNull().default(false),
  affiliateUrl: text("affiliate_url"),
  isActive: boolean("is_active").notNull().default(true),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProviderSchema = createInsertSchema(providersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
