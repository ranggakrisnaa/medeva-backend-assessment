import { prisma } from "$pkg/prisma/prisma";
import { QueryDepartment } from "$validations/domain/Departement";
import { Prisma } from "@prisma/client";

export class DepartmentRepository {
  constructor(private departmentModel = prisma.department) {}

  async FindAllDepartement(query: QueryDepartment) {
    const dataPerPage = Math.max(-1, parseInt(query.limit ?? "10") || 10);
    const page = Math.max(1, parseInt(query.page ?? "1") || 1);
    const isUnlimited = dataPerPage === -1;
    const take = isUnlimited ? undefined : Math.max(1, dataPerPage);
    const skip = isUnlimited ? 0 : Math.max(0, (page - 1) * dataPerPage);

    const filters = this.buildQueryFilter(query);

    const [departements, totalData] = await Promise.all([
      this.departmentModel.findMany({
        where: filters,
        skip,
        take,
      }),
      this.departmentModel.count({
        where: filters,
      }),
    ]);

    return {
      entries: departements,
      page: isUnlimited ? 1 : page,
      dataPerPage: isUnlimited ? totalData : dataPerPage,
      totalPages: isUnlimited ? 1 : Math.ceil(totalData / dataPerPage),
      totalData,
    };
  }

  private buildQueryFilter(query: QueryDepartment) {
    const filters: Prisma.DepartmentWhereInput = {};

    if (query.search) {
      filters.name = {
        contains: query.search,
        mode: "insensitive",
      };
    }

    return filters;
  }
}
