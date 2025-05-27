import { Router } from "express";
import { courseRouter } from "./modules/course/course.routes";

const routes: Router = Router();

routes.use("/course", courseRouter);

export { routes };