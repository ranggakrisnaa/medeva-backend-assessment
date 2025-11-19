import { asyncHandler } from "$middlewares/errorHandlerMiddleware";
import { departmentService } from "$services/index";
import {
  handleServiceErrorWithResponse,
  response_success,
} from "$utils/response.utils";
import { Request, RequestHandler, Response } from "express";

export class DepartmentController {
  getAllDepartments: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const serviceResponse = await departmentService.getAllDepartments(
        req.query
      );
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }

      return response_success(
        res,
        serviceResponse,
        "Departements retrieved successfully"
      );
    }
  );
  getAllPositions: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const serviceResponse = await departmentService.getAllPositions(
        req.query,
        req.params.departmentId
      );
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }

      return response_success(
        res,
        serviceResponse,
        "Positions retrieved successfully"
      );
    }
  );
}
