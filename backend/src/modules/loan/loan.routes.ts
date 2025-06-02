import { RequestHandler, Router } from "express";
import {LoanController} from "./loan.controller";
import { authMiddleware } from '../../middlewares/auth.middleware';

const loanRouter: Router = Router();

loanRouter.get("/loans", LoanController.getAll.bind(LoanController));
loanRouter.get("/loan/:id", LoanController.getOne.bind(LoanController));
loanRouter.put("/loan/:id", LoanController.update.bind(LoanController));
loanRouter.delete("/loan/:id", LoanController.delete.bind(LoanController));
loanRouter.use(authMiddleware as RequestHandler);
loanRouter.post("/loan", LoanController.create.bind(LoanController));
export { loanRouter };