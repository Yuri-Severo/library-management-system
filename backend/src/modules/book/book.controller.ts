import { Request, Response, NextFunction } from "express";
import { zBookSchema, zBookSchemaType } from "./book.dto";
import { BookService } from "./book.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";

export class BookController {
  static readonly bookService = new BookService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await this.bookService.getAll();
      if (books.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no books in the database",
        });
      }
      res.status(200).json(books);
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
      const book = await this.bookService.getOne(id);
      if (!book) {
        return res.status(404).json({
          error: "Not found",
          message: "Book was not found in the database",
        });
      }
      res.status(200).json(book);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zBookSchemaType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title } = req.body;
      if (!title) {
        return res.json({
          error: "missing value",
          message: "A value is missing, can't create",
        });
      }
      const validatedData = zBookSchema.parse({
        title,
      });
      const newBook = await this.bookService.create(validatedData);
      return res.status(201).json(newBook);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zBookSchema.parse(req.body);
      const bookId = req.params.id;
      if (!isUuid(bookId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const book = await this.bookService.getOne(bookId);
      if (!book) {
        return res.status(404).json({
          error: "Not found",
          message: "Book was not found in the database",
        });
      }
      const updatedBook = await this.bookService.update(
        bookId,
        validatedData
      );
      res.status(200).json(updatedBook);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const bookId = req.params.id;
      if (!isUuid(bookId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const book = await this.bookService.getOne(bookId);
      if (!book) {
        return res.status(404).json({
          error: "Not found",
          message: "Book was not found in the database",
        });
      }
      const deletedBook = await this.bookService.delete(bookId);
      res
        .status(200)
        .json({ message: "Book deleted successfully", deletedBook });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
