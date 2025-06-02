import { UserService } from "@/modules/user/user.service";
import { UserController } from "../../modules/user/user.controller";
import { Request, Response } from "express";

// Mock do UserService
const mockUserService: Partial<UserService> = {
  getAll: jest.fn().mockResolvedValue([
    { name: "Usuário Teste", role: "Admin", email: "teste@teste.com" }
  ])
};

describe("UserController", () => {
  let controller: Partial<UserController>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new UserController(mockUserService);
    req = {
      user: { id: "", role: "Admin" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("deve retornar 200 e lista de usuários para Admin", async () => {
    await controller.getAll(req as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { name: "Usuário Teste", role: "Admin", email: "teste@teste.com" }
    ]);
  });
});