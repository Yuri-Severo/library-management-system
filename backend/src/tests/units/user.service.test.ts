import { userSchema } from "../../database/schema/user.schema";
import { UserService } from "../../modules/user/user.service";
import { type DrizzleClientType } from "../../database/db.connection";
import { hash, verify } from "argon2";
import { zUserSchemaType } from "@/modules/user/user.dto";

type InsertBuilder = {
  values: jest.Mock<InsertBuilder, [any]>;
  returning: jest.Mock<Promise<zUserSchemaType[]>, [any]>;
};

type SelectBuilder = {
  from: jest.Mock<SelectBuilder, [typeof userSchema]>;
  where: jest.Mock<Promise<zUserSchemaType[]>, [any]>;
};

describe("UserService ", () => {
  let dbMock: Partial<DrizzleClientType>;
  let userService: any;

  const password = "abc";

  let fakeUser: zUserSchemaType = {
    name: "Jhon Doe",
    email: "jhon@mail.com",
    password: password,
  };

  beforeEach(() => {
    let capturedInsert: zUserSchemaType;

    const insertBuilder: InsertBuilder = {
      values: jest.fn().mockImplementation((obj) => {
        capturedInsert = obj;
        return insertBuilder;
      }),
      returning: jest.fn().mockImplementation(async () => {
        return capturedInsert;
      }),
    };

    const selectBuilder: SelectBuilder = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockImplementation(async () => {
        fakeUser.password = await hash(password)
        return [fakeUser];
      }),
    };

    dbMock = {
      insert: jest.fn().mockReturnValue(insertBuilder),
      select: jest.fn().mockReturnValue(selectBuilder),
    };

    userService = new UserService(dbMock);
  });
});