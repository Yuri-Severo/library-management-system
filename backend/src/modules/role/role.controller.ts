import { Request, Response, NextFunction } from "express";
import { zRoleSchema } from "./role.dto";
import { RoleService } from "./role.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";

export class RoleController {
  static readonly roleService = new RoleService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.roleService.getAll();
      if (roles.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no roles in the database",
        });
      }
      res.status(200).json(roles);
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
      const role = await this.roleService.getOne(id);
      if (!role) {
        return res.status(404).json({
          error: "Not found",
          message: "Role was not found in the database",
        });
      }
      res.status(200).json(role);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zRoleSchema>,
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
      const validatedData = zRoleSchema.parse({
        title,
      });
      const newRole = await this.roleService.create(validatedData);
      return res.status(201).json(newRole);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zRoleSchema.parse(req.body);
      const roleId = req.params.id;
      if (!isUuid(roleId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const role = await this.roleService.getOne(roleId);
      if (!role) {
        return res.status(404).json({
          error: "Not found",
          message: "Role was not found in the database",
        });
      }
      const updatedRole = await this.roleService.update(
        roleId,
        validatedData
      );
      res.status(200).json(updatedRole);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id;
      if (!isUuid(roleId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const role = await this.roleService.getOne(roleId);
      if (!role) {
        return res.status(404).json({
          error: "Not found",
          message: "Role was not found in the database",
        });
      }
      const deletedRole = await this.roleService.delete(roleId);
      res
        .status(200)
        .json({ message: "Role deleted successfully", deletedRole });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
