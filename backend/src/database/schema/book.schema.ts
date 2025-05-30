import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { loanSchema } from "./loan.schema";

export const bookSchema = pgTable("Book", {
  id: uuid("id").$defaultFn(() => sql`gen_random_uuid()`).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  isbn: varchar("isbn", { length: 255 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const bookRelations = relations(bookSchema, ({ many }) => ({
  loans: many(loanSchema),
}));
