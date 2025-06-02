import { roleSchema, userSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { and, count, eq } from "drizzle-orm";
import { zUserSchemaType } from "./user.dto";
import { hash, verify} from "argon2";
import { loanSchema } from "../../database/schema/loan.schema";
import * as jwt from "jsonwebtoken";

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
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    return user;
  }

  async getOneByCpf(cpf: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.cpf, cpf));

    return user;
  }

  async getByName(name: string) {
    const users = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.name, name));

    return users;
  }

  async getOneByRegistration(registration: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.registration, registration));

    return user;
  }

  async getLoansByUserId(userId: string) {
    const [{ total }] = await this.db
      .select({ total: count() })
      .from(loanSchema)
      .where(
        and(eq(loanSchema.user_id, userId), eq(loanSchema.status, "open"))
      );

    return total ?? 0;
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
      fine_amount,
      birth_date,
    } = user;
    const hashedPassword = await hash(password);
    const newUser = await this.db
      .insert(userSchema)
      .values({
        role_id: role_id,
        department_id: department_id,
        course_id: course_id,
        name: name,
        password: hashedPassword,
        email: email,
        cpf: cpf,
        registration: registration,
        phone_number: phone_number,
        address: address,
        fine_amount: fine_amount,
        birth_date: birth_date,
      })
      .returning();

    return newUser;
  }

  async login(cpf: string, password: string) {
    // Find the user by cpf
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.cpf, cpf));

    if (!user) {
      throw new Error("Invalid cpf or password");
    }

    // Check password
    const passwordMatch = await verify(user.password, password);
    if (!passwordMatch) {
      throw new Error("Invalid cpf or password");
    }

    // Get role
    const [role] = await this.db
      .select()
      .from(roleSchema)
      .where(eq(roleSchema.id, user.role_id));

    if (!role) {
      throw new Error("Role not found for the user");
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: role.title,
      },
      "JWT_SECRET",
      {
        expiresIn: "1h",
      }
    );

    // Return user info and token
    return token
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
