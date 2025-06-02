import { Router, RequestHandler } from "express";
import {UserController} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const userRouter: Router = Router();
userRouter.post('/user/login', UserController.login.bind(UserController));

userRouter.use(authMiddleware as RequestHandler); 

userRouter.post("/user/register", UserController.register.bind(UserController));
userRouter.put("/user/:id", UserController.update.bind(UserController));
userRouter.put("/user/status/:id", UserController.updateStatus.bind(UserController));
userRouter.get("/users", UserController.getAll.bind(UserController));
userRouter.get("/user/id/:id", UserController.getOneById.bind(UserController));
userRouter.get("/user/cpf/:cpf", UserController.getOneByCpf.bind(UserController));
userRouter.get("/user/name/:name", UserController.getByName.bind(UserController));
userRouter.get("/user/registration/:registration", UserController.getOneByRegistration.bind(UserController));
userRouter.delete("/user/:id", UserController.delete.bind(UserController));

export { userRouter };