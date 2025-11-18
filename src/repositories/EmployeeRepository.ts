import { PagedList } from "$entities/Query";
import { prisma } from "$pkg/prisma/prisma";
import { hashPassword } from "$utils/hash.utils";
import {
  CreateEmployeeRequest,
  QueryEmployee,
  UpdateEmployeeRequest,
} from "$validations/domain/Employee";
import { Employee, Prisma, Role } from "@prisma/client";

export class EmployeeRepository {
  constructor(private readonly employeeModel = prisma.employee) {}

  async Create(data: CreateEmployeeRequest) {
    const { employee, user } = data;

    const hashedPassword = await hashPassword(user.password);

    const employeeData: Prisma.EmployeeCreateInput = {
      fullName: employee.fullName,
      placeOfBirth: employee.placeOfBirth,
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : null,
      nik: employee.nik,
      address: employee.address,
      phone: employee.phone,
      isActive: employee.isActive,
      position: {
        connect: { id: employee.positionId },
      },
      user: {
        create: {
          email: user.email,
          username: user.username,
          password: hashedPassword,
          role: Role.USER,
        },
      },
    };

    return this.employeeModel.create({
      data: employeeData,
    });
  }

  async FindAll(query: QueryEmployee): Promise<PagedList<Employee[]>> {
    const filters = this.buildQueryFilter(query);
    const sort = this.buildSortOption(query);

    const [employees, totalData] = await Promise.all([
      prisma.employee.findMany({ where: filters, orderBy: sort }),
      prisma.employee.count({
        where: filters,
      }),
    ]);

    const dataPerPage = query.limit ?? 10;
    const page = query.page ?? 1;
    const totalPages = Math.ceil(totalData / dataPerPage);

    return {
      entries: employees,
      page,
      dataPerPage,
      totalPages,
      totalData,
    };
  }

  private buildQueryFilter(query: QueryEmployee) {
    const filter: Prisma.EmployeeWhereInput = {};

    if (query.status !== undefined) {
      filter.isActive = query.status === "active";
    }

    if (query.positionId) {
      filter.positionId = query.positionId;
    }

    if (query.search) {
      filter.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { nik: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ];
    }

    return filter;
  }

  private buildSortOption(query: QueryEmployee) {
    const sort: Prisma.EmployeeOrderByWithRelationInput = {};

    if (query.sortBy) {
      const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";
      sort[query.sortBy] = sortOrder;
    } else {
      sort.createdAt = "desc";
    }

    return sort;
  }

  CountByNIK(nik: string, excludeEmployeeId?: string) {
    return this.employeeModel.count({
      where: {
        nik,
        ...(excludeEmployeeId && { NOT: { id: excludeEmployeeId } }),
      },
    });
  }

  FindById(id: string) {
    return this.employeeModel.findUnique({ where: { id } });
  }

  Update(id: string, data: UpdateEmployeeRequest) {
    const { employee, user } = data;

    const updateData: Prisma.EmployeeUpdateInput = {
      fullName: employee?.fullName,
      placeOfBirth: employee?.placeOfBirth,
      dateOfBirth: employee?.dateOfBirth
        ? new Date(employee.dateOfBirth)
        : undefined,
      nik: employee?.nik,
      address: employee?.address,
      phone: employee?.phone,
      isActive: employee?.isActive,
      position: employee?.positionId
        ? {
            connect: { id: employee.positionId },
          }
        : undefined,
    };

    if (user) {
      updateData.user = {
        update: user,
      };
    }

    return this.employeeModel.update({ where: { id }, data: updateData });
  }
  async Delete(id: string) {
    const data = await this.employeeModel.delete({
      where: { id },
      include: { user: true },
    });

    if (data.userId) {
      await prisma.user.delete({ where: { id: data.userId } });
    }
  }
}
