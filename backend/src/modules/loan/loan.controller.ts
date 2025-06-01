import { Request, Response, NextFunction } from "express";
import { zLoanSchema, zLoanSchemaType } from "./loan.dto";
import { LoanService } from "./loan.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";
import { UserService } from "../user/user.service";
import { BookService } from "../book/book.service";

export class LoanController {
  static readonly loanService = new LoanService(db);
  static readonly userService = new UserService(db);
  static readonly bookService = new BookService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const loans = await this.loanService.getAll();
      if (loans.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no loans in the database",
        });
      }
      res.status(200).json(loans);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!isUuid(id)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const loan = await this.loanService.getOneById(id);
      if (!loan) {
        return res.status(404).json({
          error: "Not found",
          message: "Loan was not found in the database",
        });
      }
      res.status(200).json(loan);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zLoanSchemaType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { book_id, user_id } = req.body;
      if (!book_id || !user_id) {
        return res.json({
          error: "missing value",
          message: "A value is missing, can't create",
        });
      }
      
      const validatedData = zLoanSchema.parse({
        book_id,
        user_id,
      });

      const user = await this.userService.getOneById(user_id);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User not found",
        });
      }
      
      if (!user.isActive) {
        return res.status(400).json({
          error: "Bad Request",
          message: "This user is not active, cannot create a loan for him",
        });
      }

      if(user.fine_amount > 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "This user has an outstanding fine, cannot create a loan for him",
        });
      }

      const userLoans = await this.userService.getLoansByUserId(user_id);
      if( userLoans === 3 ) {
        return res.status(400).json({
          error: "Bad Request",
          message: "User already has 3 active loans, cannot create a new one",
        });
      }

      const book = await this.bookService.getOne(book_id);
      if (!book) {
        return res.status(404).json({
          error: "Not found",
          message: "Book not found",
        });
      }

      if( book.status === "loaned") {
        const loan = await this.loanService.getOneByBookId(book_id);
        return res.status(400).json({
          error: "Bad Request",
          message: `Book is already loaned. The expected return date is ${loan.due_date}`,
        });
      }
      const newLoan = await this.loanService.create(validatedData);
      return res.status(201).json(newLoan);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zLoanSchema.parse(req.body);
      const loanId = req.params.id;
      if (!isUuid(loanId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const loan = await this.loanService.getOneById(loanId);
      if (!loan) {
        return res.status(404).json({
          error: "Not found",
          message: "Loan was not found in the database",
        });
      }
      const updatedLoan = await this.loanService.update(loanId, validatedData);
      res.status(200).json(updatedLoan);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const loanId = req.params.id;
      if (!isUuid(loanId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const loan = await this.loanService.getOneById(loanId);
      if (!loan) {
        return res.status(404).json({
          error: "Not found",
          message: "Loan was not found in the database",
        });
      }
      const deletedLoan = await this.loanService.delete(loanId);
      res
        .status(200)
        .json({ message: "Loan deleted successfully", deletedLoan });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
