import { LoginRequest, RegisterRequest } from "$validations/domain/Auth";
import { BadRequestError } from "$entities/Error";
import { User } from "@prisma/client";
import { AuthRepository } from "../repositories/AuthRepository";
import bcrypt from "bcrypt";
import { ServiceResponse } from "$entities/Service";
import { BCRYPT } from "../constants/default";
import { createToken } from "$utils/token.utils";

export class AuthService {
  private readonly authRepo: AuthRepository;

  constructor(initRepo = new AuthRepository()) {
    this.authRepo = initRepo;
  }

  async Login(loginReqData: LoginRequest): Promise<ServiceResponse<unknown>> {
    const existingUser = await this.authRepo.FindByEmail(loginReqData.email);
    if (!existingUser) {
      return {
        status: false,
        err: new BadRequestError("Invalid credentials").toServiceError(),
      };
    }

    const isPasswordValid = await bcrypt.compare(
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

  async Register(registerDto: RegisterRequest): Promise<ServiceResponse<User>> {
    const existingUser = await this.authRepo.CountByEmail(registerDto.email);
    if (existingUser !== 0) {
      return {
        status: false,
        err: new BadRequestError("Email already in use").toServiceError(),
      };
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      BCRYPT.SALT_ROUNDS
    );

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
