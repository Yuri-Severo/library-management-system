import {
  pgTable,
  uuid,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { userSchema } from "./user.schema";
import { bookSchema } from "./book.schema";

export const loanSchema = pgTable("Loan", {
  id: uuid("id").$defaultFn(() => sql`gen_random_uuid()`).primaryKey(),
  book_id: uuid("book_id")
    .notNull()
    .references(() => bookSchema.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  loan_date: timestamp("loan_date", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  due_date: timestamp("due_date", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP + INTERVAL '7 days'`),
  returned_date: timestamp("returned_date", { withTimezone: true }),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const loanRelations = relations(loanSchema, ({ one }) => ({
  book: one(bookSchema, {
    fields: [loanSchema.book_id],
    references: [bookSchema.id],
  }),
  user: one(userSchema, {
    fields: [loanSchema.user_id],
    references: [userSchema.id],
  }),
}));
