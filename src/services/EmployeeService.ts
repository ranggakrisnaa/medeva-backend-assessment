import { ServiceResponse } from "$entities/Service";

export class EmployeeService {
  async CreateEmployee(): Promise<ServiceResponse<unknown>> {
    return {
      status: true,
      data: {},
    };
  }

  async GetAllEmployees(): Promise<ServiceResponse<unknown>> {
    return {
      status: true,
      data: {},
    };
  }

  async GetEmployeeById(): Promise<ServiceResponse<unknown>> {
    return {
      status: true,
      data: {},
    };
  }

  async UpdateEmployee(): Promise<ServiceResponse<unknown>> {
    return {
      status: true,
      data: {},
    };
  }

  async DeleteEmployee(): Promise<ServiceResponse<unknown>> {
    return {
      status: true,
      data: {},
    };
  }
}
