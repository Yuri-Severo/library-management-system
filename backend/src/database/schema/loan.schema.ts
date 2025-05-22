import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bookSchema } from "./book.schema";
import { userSchema } from "./user.schema";

export const loanSchema = pgTable("Loan", {
  id: uuid().$defaultFn(() => sql`gen_random_uuid()`),
  book_id: uuid("book_id")
    .notNull()
    .references(() => bookSchema.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
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

export const loanRelations = relations(loanSchema, ({ one, many }) => ({
  book: one(bookSchema, {
    fields: [loanSchema.book_id],
    references: [bookSchema.id],
  }),
  user: one(userSchema, {
    fields: [loanSchema.user_id],
    references: [userSchema.id],
  }),
}));
