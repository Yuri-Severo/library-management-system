import { Router } from "express";
import {LoanController} from "./loan.controller";

const loanRouter: Router = Router();

loanRouter.get("/loans", LoanController.getAll.bind(LoanController));
loanRouter.get("/loan/:id", LoanController.getOne.bind(LoanController));
loanRouter.put("/loan/:id", LoanController.update.bind(LoanController));
loanRouter.post("/loan", LoanController.create.bind(LoanController));
loanRouter.delete("/loan/:id", LoanController.delete.bind(LoanController));

export { loanRouter };