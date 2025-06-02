import { departmentSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zDepartmentSchema } from "./department.dto";

export class DepartmentService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const departments = await this.db.select().from(departmentSchema);
    return departments;
  }

  async getOne(id: string) {
    const department = await this.db
      .select()
      .from(departmentSchema)
      .where(eq(departmentSchema.id, id));

    return department;
  }

  async create(department: zDepartmentSchema) {
    const { title } = department;
    const newDepartment = await this.db
      .insert(departmentSchema)
      .values({
        title,
      })
      .returning();

    return newDepartment;
  }

  async update(id: string, department: zDepartmentSchema) {
    const [updatedDepartment] = await this.db
      .update(departmentSchema)
      .set({ ...department })
      .where(eq(departmentSchema.id, id))
      .returning();

    return updatedDepartment;
  }

  async delete(id: string) {
    const [deletedDepartment] = await this.db
      .delete(departmentSchema)
      .where(eq(departmentSchema.id, id))
      .returning();

    return deletedDepartment;
  }
}
