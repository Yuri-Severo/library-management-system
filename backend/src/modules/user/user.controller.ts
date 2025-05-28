import { Request, Response, NextFunction } from "express";
import { zUserSchema, zUserUpdateSchema } from "./user.dto";
import { UserService } from "./user.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";
//TODO: CPF FORMAT VALIDATOR
export class UserController {
  static readonly userService = new UserService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      if (users.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no users in the database",
        });
      }
      res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!isUuid(id)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const user = await this.userService.getOneById(id);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getOneByName(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name;
      const validatedData = zUserUpdateSchema.safeParse({name: name})
      if(!validatedData.success){
        return res.status(400).json({
          error: "Invalid sintax",
          message: "Invalid data format",
        });
      }
      const user = await this.userService.getOneByName(name);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      zUserSchema.parse({name})
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getOneByRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const registration = req.params.registration;
      const validatedData = zUserUpdateSchema.safeParse({registration: registration})
      if(!validatedData.success){
        return res.status(400).json({
          error: "Invalid sintax",
          message: "Invalid data format",
        });
      }
      const user = await this.userService.getOneByRegistration(registration);
      
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getOneByCpf(req: Request, res: Response, next: NextFunction) {
    try {
      const cpf = req.params.cpf;
      const validatedData = zUserUpdateSchema.safeParse({cpf: cpf})
      if(!validatedData.success){
        return res.status(400).json({
          error: "Invalid sintax",
          message: "Invalid data format",
        });
      }
      const user = await this.userService.getOneByCpf(cpf);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(
    req: Request<{}, {}, zUserSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        role_id,
        department_id,
        course_id,
        name,
        password,
        email,
        cpf,
        registration,
        phone_number,
        address,
      } = req.body;
      if (
        !role_id ||
        !department_id ||
        !course_id ||
        !name ||
        !password ||
        !email ||
        !cpf ||
        !registration ||
        !phone_number ||
        !address
      ) {
        return res.json({
          error: "missing value",
          message: "A value is missing, can't create",
        });
      }
      const validatedData = zUserSchema.parse({
        role_id,
        department_id,
        course_id,
        name,
        password,
        email,
        cpf,
        registration,
        phone_number,
        address,
      });

      const existingUser = await this.userService.getOneByCpf(cpf)
      if(existingUser){
        return res.json({
          error: "Cpf already registered",
          message: "The received cpf its already registered!",
        });
      }

      const newUser = await this.userService.create(validatedData);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zUserSchema.parse(req.body);
      const userId = req.params.id;
      if (!isUuid(userId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const user = await this.userService.getOneById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      const updatedUser = await this.userService.update(userId, validatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const status = req.body.status
      
      const validatedData = zUserUpdateSchema.safeParse({status: status})
      if(!validatedData.success){
        return res.status(400).json({
          error: "Invalid sintax",
          message: "Invalid data format",
        });
      }
  
      if (!isUuid(userId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }

      const user = await this.userService.getOneById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      const updatedUser = await this.userService.updateStatus(userId, status);
      res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      if (!isUuid(userId)) {
        return res.status(400).json({
          error: "Invalid ID",
          message: "Provided ID is not a valid UUID",
        });
      }
      const user = await this.userService.getOneById(userId);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found in the database",
        });
      }
      const deletedUser = await this.userService.delete(userId);
      res
        .status(200)
        .json({ message: "user deleted successfully", deletedUser });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
