import { loanSchema } from "../../database/schema/loan.schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zLoanSchemaType } from "./loan.dto";

export class LoanService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const loans = await this.db.select().from(loanSchema);
    return loans;
  }

  async getOne(id: string) {
    const loan = await this.db
      .select()
      .from(loanSchema)
      .where(eq(loanSchema.id, id));

    return loan;
  }

  async create(loan) {
    const {
      bookId,
      userId,
      loanDate,
      dueDate,
      returnedDate,
      fineAmount,
      fineStatus,
      status,
    } = loan;
    const [newLoan] = await this.db
      .insert(loanSchema)
      .values({
        book_id: bookId,
        user_id: userId,
        loan_date: loanDate,
        due_date: dueDate,
        returned_date: returnedDate,
        fine_amount: fineAmount,
        fine_status: fineStatus,
        status,
      })
      .returning();

    return newLoan;
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
