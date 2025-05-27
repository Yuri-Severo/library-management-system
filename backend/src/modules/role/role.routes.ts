import { Router } from "express";
import {RoleController} from "./role.controller";

const roleRouter: Router = Router();

roleRouter.get("/roles", RoleController.getAll.bind(RoleController));
roleRouter.get("/role/:id", RoleController.getOne.bind(RoleController));
roleRouter.put("/role/:id", RoleController.update.bind(RoleController));
roleRouter.post("/role", RoleController.create.bind(RoleController));
roleRouter.delete("/role/:id", RoleController.delete.bind(RoleController));

export { roleRouter };