import { Request, Response, NextFunction } from "express";
import { zLoanSchema, zLoanSchemaType } from "./loan.dto";
import { LoanService } from "./loan.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";

export class LoanController {
  static readonly loanService = new LoanService(db);

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
      const loan = await this.loanService.getOne(id);
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
      const {
        bookId,
        userId,
        loanDate,
        dueDate,
        returnedDate,
        fineAmount,
        fineStatus,
        status,
      } = req.body;
      if (!bookId ||
      !userId ||
      !loanDate ||
      !dueDate ||
      !fineAmount ||
      !fineStatus ||
      !status ||) {
        return res.json({
          error: "missing value",
          message: "A value is missing, can't create",
        });
      }
      const validatedData = zLoanSchema.parse({
        bookId,
        userId,
        loanDate,
        dueDate,
        returnedDate,
        fineAmount,
        fineStatus,
        status,
      });
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
      const loan = await this.loanService.getOne(loanId);
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
      const loan = await this.loanService.getOne(loanId);
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
