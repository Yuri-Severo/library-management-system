import { sql, relations} from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const departmentSchema = pgTable("Department", {
  id: uuid("id").$defaultFn(() => sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
});

export const departmentRelations = relations(departmentSchema, ({ many }) => ({
  users: many(userSchema),
}));
