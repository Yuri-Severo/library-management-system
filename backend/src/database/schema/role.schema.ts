import { sql, relations} from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const roleSchema = pgTable("Role", {
  id: uuid("id")
    .$defaultFn(() => sql`gen_random_uuid()`)
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
});

export const roleRelations = relations(roleSchema, ({ many }) => ({
  users: many(userSchema),
}));
