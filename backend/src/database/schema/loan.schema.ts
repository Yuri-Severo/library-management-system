import { relations, sql } from "drizzle-orm";
import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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
  loan_date: timestamp("loan_date", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  due_date: timestamp("due_date", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  returned_date: timestamp("returned_date", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  fine_amount: numeric("fine_amount", { precision: 8, scale: 2 }),
  fine_status: varchar("fine_status", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
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
