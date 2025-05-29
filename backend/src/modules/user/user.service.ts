import * as jwt from "jsonwebtoken";
import { userSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zUserSchemaType } from "./user.dto";
import { hash, verify } from "argon2";

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

  async getOneByName(name: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.name, name));

    return user;
  }

  async getOneByRegistration(registration: string) {
    const [user] = await this.db
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
    const hashedPassword = await hash(password)
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
      })
      .returning();

    return newUser;
  }

  async login(receivedCpf: string, receivedPassword: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.cpf, receivedCpf));
    console.log(user)
    if (!user) throw new Error("Invalid cpf or password, user not found");

    const isPasswordValid = await verify(user.password, receivedPassword);
    if (!isPasswordValid) throw new Error("Invalid password");
    const {name, cpf, password} = user;
    return jwt.sign({name, cpf, password}, "SECRET_KEY", { expiresIn: "1h" });
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
