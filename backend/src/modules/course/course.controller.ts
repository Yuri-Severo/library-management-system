import { Request, Response, NextFunction } from "express";
import { zCourseSchema } from "./course.dto";
import { CourseService } from "./course.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";

export class CourseController {
  static readonly courseService = new CourseService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await this.courseService.getAll();
      if (courses.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no courses in the database",
        });
      }
      res.status(200).json(courses);
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
      const course = await this.courseService.getOne(id);
      if (!course) {
        return res.status(404).json({
          error: "Not found",
          message: "Course was not found in the database",
        });
      }
      res.status(200).json(course);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zCourseSchema>,
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
      const validatedData = zCourseSchema.parse({
        title,
      });
      const newCourse = await this.courseService.create(validatedData);
      return res.status(201).json(newCourse);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zCourseSchema.parse(req.body);
      const courseId = req.params.id;
      if (!isUuid(courseId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const course = await this.courseService.getOne(courseId);
      if (!course) {
        return res.status(404).json({
          error: "Not found",
          message: "Course was not found in the database",
        });
      }
      const updatedCourse = await this.courseService.update(
        courseId,
        validatedData
      );
      res.status(200).json(updatedCourse);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      if (!isUuid(courseId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const course = await this.courseService.getOne(courseId);
      if (!course) {
        return res.status(404).json({
          error: "Not found",
          message: "Course was not found in the database",
        });
      }
      const deletedCourse = await this.courseService.delete(courseId);
      res
        .status(200)
        .json({ message: "Course deleted successfully", deletedCourse });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
