import { roleSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zRoleSchema } from "./role.dto";

export class RoleService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const roles = await this.db.select().from(roleSchema);
    return roles;
  }

  async getOne(id: string) {
    const role = await this.db
      .select()
      .from(roleSchema)
      .where(eq(roleSchema.id, id));

    return role;
  }

  async create(role: zRoleSchema) {
    const { title } = role;
    const newRole = await this.db
      .insert(roleSchema)
      .values({
        title,
      })
      .returning();

    return newRole;
  }

  async update(id: string, role: zRoleSchema) {
    const [updatedRole] = await this.db
      .update(roleSchema)
      .set({ ...role })
      .where(eq(roleSchema.id, id))
      .returning();

    return updatedRole;
  }

  async delete(id: string) {
    const [deletedRole] = await this.db
      .delete(roleSchema)
      .where(eq(roleSchema.id, id))
      .returning();

    return deletedRole;
  }
}
