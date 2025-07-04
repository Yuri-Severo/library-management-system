import { Request, Response, NextFunction } from "express";
import {
  validateCPF,
  zUserPartialUpdateSchema,
  zUserSchema,
  zUserSchemaType,
  zUserUpdateSchema,
} from "./user.dto";
import { UserService } from "./user.service";
import { db } from "../../database/db.connection";
import { validate as isUuid } from "uuid";
import { createAuditLog } from "../audit_log";
//TODO: PROTECTION AGAINST CONCURRENT EDITS
//TODO: Maintaining referential integrity
export class UserController {
  static readonly userService = new UserService(db);

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      const requestingUserRole = req.user.role;
      if (users.length === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: "There's no users",
        });
      }
       if(requestingUserRole === "Admin"){
         return res.status(200).json(users);
       } else if(requestingUserRole === "Librarian"){
      const filteredUsers = users.map(user => ({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        fine_amount: user.fine_amount,
        registration: user.registration,
        cpf: user.cpf
      }))
         return res.status(200).json(filteredUsers);
       } else {
       return res.status(400).json({
         error: "Bad Request",
         message: "This user does not have permission to see this data",
       });
      }
    } catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const requestingUserRole = req.user.role;
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
      if(requestingUserRole === "Admin"){
        return res.status(200).json(user);
      } else if(requestingUserRole === "Librarian"){
        const {name, email, phone_number, address, fine_amount, registration,cpf} = user;
        return res.status(200).json({name, email, phone_number, address, fine_amount, registration, cpf});
      } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "This user does not have permission to see this data",
      });
    }} catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name;
      const requestingUserRole = req.user.role;
      if (!name) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Must have a name for this search",
        });
      }
      const users = await this.userService.getByName(name);
      if (!users) {
        return res.status(404).json({
          error: "Not found",
          message: "None user was found",
        });
      }
      if(requestingUserRole === "Admin"){
        return res.status(200).json(users);
      } else if(requestingUserRole === "Librarian"){
        const filteredUsers = users.map(user => ({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        fine_amount: user.fine_amount,
        registration: user.registration,
        cpf: user.cpf
      }))
         return res.status(200).json(filteredUsers);
      } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "This user does not have permission to see this data",
      });
    }} catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async getOneByRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const registration = req.params.registration;
      const requestingUserRole = req.user.role;
      if (!registration) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Must have a registration for this search",
        });
      }
      const user = await this.userService.getOneByRegistration(registration);

      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found",
        });
      }
      if(requestingUserRole === "Admin"){
        return res.status(200).json(user);
      } else if(requestingUserRole === "Librarian"){
        const {name, email, phone_number, address, fine_amount, registration,cpf} = user;
        return res.status(200).json({name, email, phone_number, address, fine_amount, registration, cpf});
      } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "This user does not have permission to see this data",
      });
    }} catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async getOneByCpf(req: Request, res: Response, next: NextFunction) {
    try {
      const cpf = req.params.cpf;
      const requestingUserRole = req.user.role;
      if (!cpf) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Must have a cpf for this search",
        });
      }
      if (!validateCPF(cpf)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid sintax for CPF",
        });
      }
      const user = await this.userService.getOneByCpf(cpf);
      if (!user) {
        return res.status(404).json({
          error: "Not found",
          message: "User was not found",
        });
      }
      if(requestingUserRole === "Admin"){
        return res.status(200).json(user);
      } else if(requestingUserRole === "Librarian"){
        const {name, email, phone_number, address, fine_amount, registration,cpf} = user;
        return res.status(200).json({name, email, phone_number, address, fine_amount, registration, cpf});
      } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "This user does not have permission to see this data",
      });
    }} catch (error) {
      console.error("Error in backend: " + error);
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
        fine_amount,
        birth_date,
      } = req.body;
      const requestingUserRole = req.user.role;
      if(requestingUserRole !== "Admin" && requestingUserRole !== "Librarian"){
       return res.status(400).json({
         error: "Bad Request",
         message: "This user does not have permission to do this action",
       });
      }
      
      if (
        !role_id ||
        (!department_id && !course_id) ||
        !name ||
        !password ||
        !cpf ||
        !phone_number ||
        !address ||
        !birth_date
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
        fine_amount,
        birth_date,
      });
      if (!validateCPF(cpf)) {
        return res.status(400).json({
          error: "Invalid value",
          message: "Invalid sintax for CPF",
        });
      }
      const existingUser = await this.userService.getOneByCpf(cpf);
      if (existingUser) {
        return res.json({
          error: "Cpf already registered",
          message: "The received cpf its already registered!",
        });
      }

      const newUser = await this.userService.register(validatedData);
      if(requestingUserRole === "Admin"){
        return res.status(200).json(newUser);
      } else {
        const {name, email, phone_number, address, fine_amount, registration,cpf} = newUser;
        return res.status(200).json({name, email, phone_number, address, fine_amount, registration, cpf});
      }
    } catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async login(req: Request, res: Response) {
    const { cpf, password } = req.body;
    try {
      const token = await this.userService.login(cpf, password);
      return res.status(201).cookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }).json({
        success:true,
        message: "Login successful",
        token: token,
      })
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = zUserUpdateSchema.parse(req.body);
      const userId = req.params.id;
      const actor_user_id = req.user.id;
      const requestingUserRole = req.user.role;

      if(requestingUserRole !== "Admin" && requestingUserRole !== "Librarian"){
       return res.status(400).json({
         error: "Bad Request",
         message: "This user does not have permission to do this action",
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
      const updatedUser = await this.userService.update(userId, validatedData);
      await createAuditLog({
        action: "UPDATE_USER",
        actor_user_id: actor_user_id,
        target_user_id: userId,
        changed_data: {before: user, after: updatedUser},
      })
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const reason = req.body.reason;
      const status = req.body.status;
      const action = status === true ? "ENABLE_USER" : "DISABLE_USER";
      const actor_user_id = req.user.id;
      const requestingUserRole = req.user.role;

      if(requestingUserRole !== "Admin"){
       return res.status(400).json({
         error: "Bad Request",
         message: "This user does not have permission to do this action",
       });
      }

      const validatedData = zUserPartialUpdateSchema.safeParse({
        status: status,
        reason: reason,
      });
      if (!validatedData.success) {
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

      const userLoans = await this.userService.getLoansByUserId(userId);
      if (userLoans > 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "This user has pending loans, can't change status",
        });
      }
      const updatedUser = await this.userService.updateStatus(userId, status);
      await createAuditLog({
        action: action,
        actor_user_id: actor_user_id,
        target_user_id: userId,
        changed_data: {before: user, after: updatedUser, reason: reason},
      })
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in backend: " + error);
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
      console.error("Error in backend: " + error);
      return res.status(500).json(error);
    }
  }
}
