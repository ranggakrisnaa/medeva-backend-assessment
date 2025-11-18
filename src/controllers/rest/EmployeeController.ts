import { asyncHandler } from "$middlewares/errorHandlerMiddleware";
import { employeeService } from "$services/index";
import {
  handleServiceErrorWithResponse,
  response_success,
} from "$utils/response.utils";
import { Request, RequestHandler, Response } from "express";

export class EmployeeController {
  CreateEmployee: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.CreateEmployee();
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse,
        "Employee created successfully"
      );
    }
  );
}
