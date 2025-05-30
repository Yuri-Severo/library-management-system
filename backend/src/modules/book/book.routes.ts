import { Router } from "express";
import {BookController} from "./book.controller";

const bookRouter: Router = Router();

bookRouter.get("/books", BookController.getAll.bind(BookController));
bookRouter.get("/book/:id", BookController.getOne.bind(BookController));
bookRouter.put("/book/:id", BookController.update.bind(BookController));
bookRouter.post("/book", BookController.create.bind(BookController));
bookRouter.delete("/book/:id", BookController.delete.bind(BookController));

export { bookRouter };