import { RequestHandler, Request, Response } from "express";
import { authService } from "$services/index";
import {
  handleServiceErrorWithResponse,
  response_success,
} from "$utils/response.utils";
import { asyncHandler } from "$middlewares/errorHandlerMiddleware";

export class AuthController {
  registerUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await authService.registerUser(req.body);
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse,
        "User registered successfully"
      );
    }
  );
  loginUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const serviceResponse = await authService.loginUser(req.body);
      if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse);
      }
      return response_success(
        res,
        serviceResponse,
        "User logged in successfully"
      );
    }
  );
}
