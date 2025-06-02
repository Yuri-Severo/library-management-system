import { sql, relations} from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const courseSchema = pgTable("Course", {
  id: uuid("id").$defaultFn(() => sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
});

export const courseRelations = relations(courseSchema, ({ many }) => ({
  users: many(userSchema),
}));
