import { BadRequestError } from "$entities/Error";
import { ServiceResponse } from "$entities/Service";
import {
  CreateEmployeeRequest,
  QueryEmployee,
  UpdateEmployeeRequest,
} from "$validations/domain/Employee";
import { EmployeeRepository } from "repositories/EmployeeRepository";
import { PositionRepository } from "repositories/PositionRepository";
import { UserRepository } from "repositories/UserRepository";

export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository = new EmployeeRepository(),
    private readonly positionRepository: PositionRepository = new PositionRepository(),
    private readonly userRepository: UserRepository = new UserRepository()
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeRequest
  ): Promise<ServiceResponse<unknown>> {
    await this.validateEmployeeData(
      createEmployeeDto.employee.positionId,
      createEmployeeDto.employee.nik
    );

    await this.validateUserData(
      createEmployeeDto.user.username,
      createEmployeeDto.user.email
    );

    const result = await this.employeeRepository.Create(createEmployeeDto);

    return {
      status: true,
      data: result,
    };
  }

  async getAllEmployees(
    query: QueryEmployee
  ): Promise<ServiceResponse<unknown>> {
    const result = await this.employeeRepository.FindAll(query);

    return {
      status: true,
      data: result,
    };
  }

  async getEmployeeById(id: string): Promise<ServiceResponse<unknown>> {
    const result = await this.validateEmployeeId(id);
    return {
      status: true,
      data: result,
    };
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeRequest
  ): Promise<ServiceResponse<unknown>> {
    const employee = await this.employeeRepository.FindById(id);
    if (!employee) {
      throw new BadRequestError("Employee not found");
    }

    await this.validateEmployeeData(
      updateEmployeeDto.employee?.positionId ?? undefined,
      updateEmployeeDto.employee?.nik ?? undefined,
      id
    );

    await this.validateUserData(
      updateEmployeeDto.user?.username ?? undefined,
      updateEmployeeDto.user?.email ?? undefined,
      employee.userId ?? undefined
    );

    const result = await this.employeeRepository.Update(id, updateEmployeeDto);

    return {
      status: true,
      data: result,
    };
  }

  async deleteEmployee(id: string): Promise<ServiceResponse<unknown>> {
    const result = await this.validateEmployeeId(id);

    await this.employeeRepository.Delete(id);
    return {
      status: true,
      data: result,
    };
  }

  private async validateEmployeeData(
    positionId: string | undefined,
    nik: string | undefined,
    employeeId?: string
  ) {
    const [positionCount, nikCount] = await Promise.all([
      positionId
        ? this.positionRepository.CountById(positionId)
        : Promise.resolve(0),
      nik
        ? this.employeeRepository.CountByNIK(nik, employeeId)
        : Promise.resolve(0),
    ]);

    if (positionId && positionCount === 0) {
      throw new BadRequestError("Position not found");
    }
    if (nik && nikCount !== 0) {
      throw new BadRequestError("NIK already exists");
    }
  }

  private async validateUserData(
    username: string | undefined,
    email: string | undefined,
    userId?: string
  ) {
    const [usernameCount, emailCount] = await Promise.all([
      username
        ? this.userRepository.CountByUsername(username, userId)
        : Promise.resolve(0),
      email
        ? this.userRepository.CountByEmail(email, userId)
        : Promise.resolve(0),
    ]);

    if (username && usernameCount !== 0) {
      throw new BadRequestError("Username already exists");
    }
    if (email && emailCount !== 0) {
      throw new BadRequestError("Email already exists");
    }
  }

  private async validateEmployeeId(id: string) {
    const result = await this.employeeRepository.FindById(id);
    if (!result) {
      throw new BadRequestError("Employee not found");
    }

    return result;
  }
}
