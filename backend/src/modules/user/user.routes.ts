import { Router, RequestHandler } from "express";
import {UserController} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserService } from "./user.service";
import { db } from "@/database/db.connection";

const userRouter: Router = Router();
const userController = new UserController(new UserService(db));

userRouter.post('/user/login', userController.login.bind(userController));

userRouter.use(authMiddleware as RequestHandler); 

userRouter.post("/user/register", userController.register.bind(userController));
userRouter.put("/user/:id", userController.update.bind(userController));
userRouter.put("/user/status/:id", userController.updateStatus.bind(userController));
userRouter.get("/users", userController.getAll.bind(userController));
userRouter.get("/user/id/:id", userController.getOneById.bind(userController));
userRouter.get("/user/cpf/:cpf", userController.getOneByCpf.bind(userController));
userRouter.get("/user/name/:name", userController.getByName.bind(userController));
userRouter.get("/user/registration/:registration", userController.getOneByRegistration.bind(userController));
userRouter.delete("/user/:id", userController.delete.bind(userController));

export { userRouter };