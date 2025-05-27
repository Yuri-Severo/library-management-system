import { Router } from "express";
import { courseRouter } from "./modules/course/course.routes";
import { roleRouter } from "./modules/role/role.routes";
import { departmentRouter } from "./modules/department/department.routes";

const routes: Router = Router();

routes.use("/course", courseRouter);
routes.use("/role", roleRouter);
routes.use("/department", departmentRouter);

export { routes };