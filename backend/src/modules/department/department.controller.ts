import { Request, Response, NextFunction } from "express";
import { zDepartmentSchema } from "./department.dto";
import { DepartmentService } from "./department.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";

export class DepartmentController {
  static readonly departmentService = new DepartmentService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await this.departmentService.getAll();
      if (departments.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no departments in the database",
        });
      }
      res.status(200).json(departments);
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
      const department = await this.departmentService.getOne(id);
      if (!department) {
        return res.status(404).json({
          error: "Not found",
          message: "Department was not found in the database",
        });
      }
      res.status(200).json(department);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zDepartmentSchema>,
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
      const validatedData = zDepartmentSchema.parse({
        title,
      });
      const newDepartment = await this.departmentService.create(validatedData);
      return res.status(201).json(newDepartment);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zDepartmentSchema.parse(req.body);
      const departmentId = req.params.id;
      if (!isUuid(departmentId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const department = await this.departmentService.getOne(departmentId);
      if (!department) {
        return res.status(404).json({
          error: "Not found",
          message: "Department was not found in the database",
        });
      }
      const updatedDepartment = await this.departmentService.update(
        departmentId,
        validatedData
      );
      res.status(200).json(updatedDepartment);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const departmentId = req.params.id;
      if (!isUuid(departmentId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const department = await this.departmentService.getOne(departmentId);
      if (!department) {
        return res.status(404).json({
          error: "Not found",
          message: "Department was not found in the database",
        });
      }
      const deletedDepartment = await this.departmentService.delete(departmentId);
      res
        .status(200)
        .json({ message: "Department deleted successfully", deletedDepartment });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
