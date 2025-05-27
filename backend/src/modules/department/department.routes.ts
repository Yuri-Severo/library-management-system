import { Router } from "express";
import {DepartmentController} from "./department.controller";

const departmentRouter: Router = Router();

departmentRouter.get("/departments", DepartmentController.getAll.bind(DepartmentController));
departmentRouter.get("/department/:id", DepartmentController.getOne.bind(DepartmentController));
departmentRouter.put("/department/:id", DepartmentController.update.bind(DepartmentController));
departmentRouter.post("/department", DepartmentController.create.bind(DepartmentController));
departmentRouter.delete("/department/:id", DepartmentController.delete.bind(DepartmentController));

export { departmentRouter };