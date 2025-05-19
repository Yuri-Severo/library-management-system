import { relations, sql } from "drizzle-orm";
import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const auditLogsSchema = pgTable("auditLogs", {
  id: uuid().$defaultFn(() => sql`gen_random_uuid()`),
  action: varchar("action", { length: 255 }).notNull(),
  actor_user_id: uuid("actor_user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  target_user_id: uuid("target_user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  occurred_at: timestamp("occurred_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  changed_data: json().notNull()
});

export const auditLogsRelations = relations(auditLogsSchema, ({ one }) => ({
    actor_user: one(userSchema, {
        fields: [auditLogsSchema.actor_user_id],
        references: [userSchema.id],
      }),
    target_user: one(userSchema, {
        fields: [auditLogsSchema.target_user_id],
        references: [userSchema.id],
      }), 
})
);
