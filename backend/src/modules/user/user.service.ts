import { userSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zUserSchemaType } from "./user.dto";

export class UserService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const users = await this.db.select().from(userSchema);
    return users;
  }

  async getOneById(id: string) {
    const user = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    return user;
  }

  async getOneByCpf(cpf: string) {
    const user = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.cpf, cpf));

    return user;
  }

  async getOneByName(name: string) {
    const user = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.name, name));

    return user;
  }

  async getOneByRegistration(registration: string) {
    const user = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.registration, registration));

    return user;
  }

  async register(user: zUserSchemaType) {
    const {
      role_id,
      department_id,
      course_id,
      name,
      password,
      email,
      cpf,
      registration,
      phone_number,
      address,
    } = user;
    const newUser = await this.db
      .insert(userSchema)
      .values({
        role_id,
        department_id,
        course_id,
        name,
        password,
        email,
        cpf,
        registration,
        phone_number,
        address,
      })
      .returning();

    return newUser;
  }

  async update(id: string, user: zUserSchemaType) {
    const [updatedUser] = await this.db
      .update(userSchema)
      .set({ ...user })
      .where(eq(userSchema.id, id))
      .returning();

    return updatedUser;
  }

  async updateStatus(id: string, status: boolean) {
    const [updatedUser] = await this.db
      .update(userSchema)
      .set({ isActive: status })
      .where(eq(userSchema.id, id))
      .returning();

    return updatedUser;
  }

  async delete(id: string) {
    const [deletedUser] = await this.db
      .delete(userSchema)
      .where(eq(userSchema.id, id))
      .returning();

    return deletedUser;
  }

}
