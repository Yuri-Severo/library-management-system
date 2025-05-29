import { Request, Response, NextFunction } from "express";
import { zUserPartialUpdateSchema, zUserSchema, zUserSchemaType, zUserUpdateSchema } from "./user.dto";
import { UserService } from "./user.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";
//TODO: LOGIN METHOD
//TODO: VERIFY ROLE INSIDE METHODS
//TODO: USER RETURNS INFO BASED ON THE ROLE
//TODO: WHEN UPDATE, SEND IT TO AUDIT_LOGS (WHO,WHEN,WHAT)
//TODO: PROTECTION AGAINST CONCURRENT EDITS
//TODO: Maintaining referential integrity
//TODO: VERIFY PENDING LOANS
//TODO: REGISTER TIMESTAMPS AND REASON WHEN ENABLE/DISABLE USER
export class UserController {
  static readonly userService = new UserService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      if (users.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no users",
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
          message: "User was not found",
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
      const validatedData = zUserPartialUpdateSchema.safeParse({name: name})
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
          message: "User was not found",
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
      const validatedData = zUserPartialUpdateSchema.safeParse({registration: registration})
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
          message: "User was not found",
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
      const validatedData = zUserPartialUpdateSchema.safeParse({cpf: cpf})
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
          message: "User was not found",
        });
      }
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async register(
    req: Request<{}, {}, zUserSchemaType>,
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
        !department_id &&
        !course_id ||
        !name ||
        !password ||
        !cpf ||
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

      const newUser = await this.userService.register(validatedData);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { cpf, password } = req.body;

      if (!cpf || !password) {
        next("CPF or password missing");
      }
      const user = await this.userService.login(cpf, password);
      res.status(200).json({ message: "Logged In", user });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zUserUpdateSchema.parse(req.body);
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
          message: "User was not found",
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
      
      const validatedData = zUserPartialUpdateSchema.safeParse({status: status})
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
          message: "User was not found",
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
          message: "User was not found",
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
