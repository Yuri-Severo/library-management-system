import { Router } from "express";
import {CourseController} from "./course.controller";

const courseRouter: Router = Router();

courseRouter.get("/courses", CourseController.getAll.bind(CourseController));
courseRouter.get("/course/:id", CourseController.getOne.bind(CourseController));
courseRouter.put("/course/:id", CourseController.update.bind(CourseController));
courseRouter.post("/course", CourseController.create.bind(CourseController));
courseRouter.delete("/course/:id", CourseController.delete.bind(CourseController));

export { courseRouter };