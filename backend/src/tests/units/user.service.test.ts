import { UserController } from "../../modules/user/user.controller";
import { Request, Response } from "express";

// Função utilitária para criar mocks de req e res
function mockResponse() {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("UserController", () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(() => {
    mockUserService = {
      getAll: jest.fn(),
      getOneById: jest.fn(),
      getByName: jest.fn(),
      getOneByRegistration: jest.fn(),
      getOneByCpf: jest.fn(),
      register: jest.fn(),
      login: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      getLoansByUserId: jest.fn(),
      delete: jest.fn(),
    };
    controller = new UserController(mockUserService);
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("retorna 200 e lista de usuários para Admin", async () => {
      mockUserService.getAll.mockResolvedValue([{ name: "Usuário Teste", role: "Admin", email: "teste@teste.com" }]);
      const req = { user: { role: "Admin" } } as Request;
      const res = mockResponse();

      await controller.getAll(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ name: "Usuário Teste", role: "Admin", email: "teste@teste.com" }]);
    });

    it("retorna 404 se não houver usuários", async () => {
      mockUserService.getAll.mockResolvedValue([]);
      const req = { user: { role: "Admin" } } as Request;
      const res = mockResponse();

      await controller.getAll(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 400 se não for Admin ou Librarian", async () => {
      mockUserService.getAll.mockResolvedValue([{ name: "Usuário Teste" }]);
      const req = { user: { role: "User" } } as Request;
      const res = mockResponse();

      await controller.getAll(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getOneById", () => {
    it("retorna 400 para id inválido", async () => {
      const req = { params: { id: "123" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneById(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 404 se usuário não encontrado", async () => {
      mockUserService.getOneById.mockResolvedValue(null);
      const req = { params: { id: "550e8400-e29b-41d4-a716-446655440000" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneById(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 200 para Admin", async () => {
      mockUserService.getOneById.mockResolvedValue({ name: "Usuário" });
      const req = { params: { id: "550e8400-e29b-41d4-a716-446655440000" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneById(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getByName", () => {
    it("retorna 400 se não passar nome", async () => {
      const req = { params: {}, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getByName(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 404 se não encontrar usuários", async () => {
      mockUserService.getByName.mockResolvedValue(null);
      const req = { params: { name: "Teste" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getByName(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 200 para Admin", async () => {
      mockUserService.getByName.mockResolvedValue([{ name: "Usuário" }]);
      const req = { params: { name: "Usuário" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getByName(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getOneByRegistration", () => {
    it("retorna 400 se não passar registration", async () => {
      const req = { params: {}, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneByRegistration(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 404 se usuário não encontrado", async () => {
      mockUserService.getOneByRegistration.mockResolvedValue(null);
      const req = { params: { registration: "123" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneByRegistration(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 200 para Admin", async () => {
      mockUserService.getOneByRegistration.mockResolvedValue({ name: "Usuário" });
      const req = { params: { registration: "123" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneByRegistration(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getOneByCpf", () => {
    it("retorna 400 se não passar cpf", async () => {
      const req = { params: {}, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneByCpf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 400 se cpf inválido", async () => {
      const req = { params: { cpf: "123" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      await controller.getOneByCpf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 404 se usuário não encontrado", async () => {
      mockUserService.getOneByCpf.mockResolvedValue(null);
      const req = { params: { cpf: "12345678909" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      // Mock validateCPF para true
      jest.spyOn(require("../../modules/user/user.dto"), "validateCPF").mockReturnValue(true);

      await controller.getOneByCpf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 200 para Admin", async () => {
      mockUserService.getOneByCpf.mockResolvedValue({ name: "Usuário" });
      const req = { params: { cpf: "12345678909" }, user: { role: "Admin" } } as any;
      const res = mockResponse();

      jest.spyOn(require("../../modules/user/user.dto"), "validateCPF").mockReturnValue(true);

      await controller.getOneByCpf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("register", () => {
    it("retorna 400 se não for Admin ou Librarian", async () => {
      const req = { body: {}, user: { role: "User" } } as any;
      const res = mockResponse();

      await controller.register(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
    // Adicione outros testes para campos obrigatórios, CPF inválido, etc.
  });

  describe("login", () => {
    it("retorna 201 e token ao logar", async () => {
      mockUserService.login.mockResolvedValue("token123");
      const req = { body: { cpf: "123", password: "senha" } } as any;
      const res = mockResponse();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "token123" }));
    });

    it("retorna 401 se falhar login", async () => {
      mockUserService.login.mockRejectedValue(new Error("fail"));
      const req = { body: { cpf: "123", password: "senha" } } as any;
      const res = mockResponse();

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("update", () => {
    it("retorna 400 se não for Admin ou Librarian", async () => {
      const req = { params: { id: "id" }, body: {}, user: { id: "actor", role: "User" } } as any;
      const res = mockResponse();

      await controller.update(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updateStatus", () => {
    it("retorna 400 se não for Admin", async () => {
      const req = { params: { id: "id" }, body: {}, user: { id: "actor", role: "User" } } as any;
      const res = mockResponse();

      await controller.updateStatus(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("delete", () => {
    it("retorna 400 para id inválido", async () => {
      const req = { params: { id: "123" } } as any;
      const res = mockResponse();

      await controller.delete(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("retorna 404 se usuário não encontrado", async () => {
      mockUserService.getOneById.mockResolvedValue(null);
      const req = { params: { id: "550e8400-e29b-41d4-a716-446655440000" } } as any;
      const res = mockResponse();

      await controller.delete(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("retorna 200 ao deletar", async () => {
      mockUserService.getOneById.mockResolvedValue({ name: "Usuário" });
      mockUserService.delete.mockResolvedValue({ name: "Usuário" });
      const req = { params: { id: "550e8400-e29b-41d4-a716-446655440000" } } as any;
      const res = mockResponse();

      await controller.delete(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});