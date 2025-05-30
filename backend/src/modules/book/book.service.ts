import { bookSchema } from "../../database/schema/book.schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zBookSchemaType } from "./book.dto";

export class BookService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const books = await this.db.select().from(bookSchema);
    return books;
  }

  async getOne(id: string) {
    const [book] = await this.db
      .select()
      .from(bookSchema)
      .where(eq(bookSchema.id, id));

    return book;
  }

  async create(book: zBookSchemaType) {
    const { title, code, isbn, status } = book;
    const newBook = await this.db
      .insert(bookSchema)
      .values({
        title,
        code,
        isbn,
        status,
      })
      .returning();

    return newBook;
  }

  async update(id: string, book: zBookSchemaType) {
    const [updatedBook] = await this.db
      .update(bookSchema)
      .set({ ...book, updated_at: new Date()})
      .where(eq(bookSchema.id, id))
      .returning();

    return updatedBook;
  }

  async delete(id: string) {
    const [deletedBook] = await this.db
      .delete(bookSchema)
      .where(eq(bookSchema.id, id))
      .returning();

    return deletedBook;
  }
}
