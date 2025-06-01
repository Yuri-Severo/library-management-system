import { sql, relations } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, boolean, integer,  } from "drizzle-orm/pg-core";
import { roleSchema } from "./role.schema";
import { departmentSchema } from "./department.schema";
import { courseSchema } from "./course.schema";
import { loanSchema } from "./loan.schema";
import { auditLogsSchema } from "./audit_logs.schema";

export const userSchema = pgTable("User", {
  id: uuid("id")
    .$defaultFn(() => sql`gen_random_uuid()`)
    .primaryKey(),
  role_id: uuid("role_id")
    .notNull()
    .references(() => roleSchema.id, { onDelete: "cascade" }),
  department_id: uuid("department_id")
    .references(() => departmentSchema.id, { onDelete: "cascade" }),
  course_id: uuid("course_id")
    .references(() => courseSchema.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 255 }).notNull(),
  registration: varchar("registration", { length: 255 }),
  phone_number: varchar("phone_number", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  isActive: boolean().default(true),
  fine_amount: integer("fine_amount")
    .notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userRelations = relations(userSchema, ({ one, many }) => ({
  role: one(roleSchema, {
    fields: [userSchema.role_id],
    references: [roleSchema.id],
  }),
  course: one(courseSchema, {
    fields: [userSchema.course_id],
    references: [courseSchema.id],
  }),
  department: one(departmentSchema, {
    fields: [userSchema.department_id],
    references: [departmentSchema.id],
  }),
  loans: many(loanSchema),
  audit_logs: many(auditLogsSchema)
}));
