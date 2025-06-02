import { Router } from "express";
import {UserController} from "./user.controller";

const userRouter: Router = Router();

userRouter.get("/users", UserController.getAll.bind(UserController));
userRouter.get("/user/:id", UserController.getOneById.bind(UserController));
userRouter.get("/user/cpf/:cpf", UserController.getOneByCpf.bind(UserController));
userRouter.get("/user/name/:name", UserController.getByName.bind(UserController));
userRouter.get("/user/registration/:registration", UserController.getOneByRegistration.bind(UserController));
userRouter.put("/user/:id", UserController.update.bind(UserController));
userRouter.post("/user/register", UserController.register.bind(UserController));
userRouter.post('/user/login', UserController.login.bind(UserController));
userRouter.delete("/user/:id", UserController.delete.bind(UserController));

export { userRouter };