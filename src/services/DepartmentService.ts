import { ServiceResponse } from "$entities/Service";
import {
  QueryDepartment,
  QueryPosition,
} from "$validations/domain/Departement";
import { DepartmentRepository } from "repositories/DepartmentRepository";
import { PositionRepository } from "repositories/PositionRepository";

export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository = new DepartmentRepository(),
    private positionRepository: PositionRepository = new PositionRepository()
  ) {}

  async getAllDepartments(
    query: QueryDepartment
  ): Promise<ServiceResponse<unknown>> {
    const result = await this.departmentRepository.FindAllDepartement(query);

    return {
      status: true,
      data: result,
    };
  }

  async getAllPositions(
    query: QueryPosition,
    departmentId: string
  ): Promise<ServiceResponse<unknown>> {
    const result = await this.positionRepository.FindByDepartementId(
      query,
      departmentId
    );

    return {
      status: true,
      data: result,
    };
  }
}
