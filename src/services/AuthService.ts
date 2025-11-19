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
      throw new BadRequestError("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(
      loginReqData.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid credentials");
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
      throw new BadRequestError("Email already in use");
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

  async getCurrentUser(
    userId: string
  ): Promise<ServiceResponse<Omit<User, "password">>> {
    const user = await this.authRepo.FindById(userId);
    if (!user) {
      return {
        status: false,
        err: new BadRequestError("User not found").toServiceError(),
      };
    }

    const { password, ...userWithoutPassword } = user;

    return {
      status: true,
      data: userWithoutPassword,
    };
  }
}
