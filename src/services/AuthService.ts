import { LoginRequest, RegisterRequest } from "$validations/domain/Auth";
import { BadRequestError } from "$entities/Error";
import { User } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { ServiceResponse } from "$entities/Service";
import { createToken } from "$utils/token.utils";
import { comparePassword, hashPassword } from "$utils/hash.utils";

export class AuthService {
  constructor(
    private readonly authRepo: UserRepository = new UserRepository()
  ) {}

  async loginUser(
    loginReqData: LoginRequest
  ): Promise<ServiceResponse<Record<string, string>>> {
    const existingUser = await this.authRepo.FindByEmail(loginReqData.email);
    if (!existingUser) {
      return {
        status: false,
        err: new BadRequestError("Invalid credentials").toServiceError(),
      };
    }

    const isPasswordValid = await comparePassword(
      loginReqData.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return {
        status: false,
        err: new BadRequestError("Invalid credentials").toServiceError(),
      };
    }

    const accessToken = createToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    return {
      status: true,
      data: {
        userId: existingUser.id,
        accessToken,
      },
    };
  }

  async registerUser(
    registerDto: RegisterRequest
  ): Promise<ServiceResponse<User>> {
    const existingUser = await this.authRepo.CountByEmail(registerDto.email);
    if (existingUser !== 0) {
      return {
        status: false,
        err: new BadRequestError("Email already in use").toServiceError(),
      };
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const newUser = await this.authRepo.Create({
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
      role: "USER",
    });

    return {
      status: true,
      data: newUser,
    };
  }
}
