import { loanSchema } from "../../database/schema/loan.schema";
import { DrizzleClientType } from "../../database/db.connection";
import { and, eq } from "drizzle-orm";
import { zLoanSchemaType } from "./loan.dto";
import { bookSchema } from "../../database/schema/book.schema";

export class LoanService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const loans = await this.db.select().from(loanSchema);
    return loans;
  }

  async getOneById(id: string) {
    const [loan] = await this.db
      .select()
      .from(loanSchema)
      .where(eq(loanSchema.id, id));

    return loan;
  }

  async getOneByBookId(book_id: string) {
    const [loan] = await this.db
      .select()
      .from(loanSchema)
      .where(and(eq(loanSchema.book_id, book_id), eq(loanSchema.status, 'open')));
    return loan;
  }

  async create(loan: zLoanSchemaType) {
    const result = await this.db.transaction(async (tx) => {
      const { book_id, user_id } = loan;

      const [newLoan] = await tx
        .insert(loanSchema)
        .values({
          book_id: book_id,
          user_id: user_id,
        })
        .returning();

      await tx
        .update(bookSchema)
        .set({ status: "loaned" })
        .where(eq(bookSchema.id, book_id));

      return newLoan;
    });
    return result;
  }

  async update(id: string, loan: zLoanSchemaType) {
    const [updatedLoan] = await this.db
      .update(loanSchema)
      .set({ ...loan })
      .where(eq(loanSchema.id, id))
      .returning();

    return updatedLoan;
  }

  async delete(id: string) {
    const [deletedLoan] = await this.db
      .delete(loanSchema)
      .where(eq(loanSchema.id, id))
      .returning();

    return deletedLoan;
  }
}
