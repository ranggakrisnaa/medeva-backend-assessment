import { asyncHandler } from "$middlewares/errorHandlerMiddleware";
import { employeeService } from "$services/index";
import {
  handleServiceErrorWithResponse,
  response_success,
} from "$utils/response.utils";
import { Request, RequestHandler, Response } from "express";

export class EmployeeController {
  createEmployee: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.createEmployee(req.body);
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse.data,
        "Employee created successfully"
      );
    }
  );
  getAllEmployees: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.getAllEmployees(req.query);
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse.data,
        "Employees retrieved successfully"
      );
    }
  );
  getEmployeeById: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.getEmployeeById(
        req.params.id
      );
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse.data,
        "Employee retrieved successfully"
      );
    }
  );
  updateEmployee: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.updateEmployee(
        req.params.id,
        req.body
      );
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse.data,
        "Employee updated successfully"
      );
    }
  );
  deleteEmployee: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await employeeService.deleteEmployee(
        req.params.id
      );
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse.data,
        "Employee deleted successfully"
      );
    }
  );
}
