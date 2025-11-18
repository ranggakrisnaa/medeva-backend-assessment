export interface ServiceResponse<T> {
  data?: T;
  err?: ServiceError;
  status: boolean;
}

interface ServiceError {
  message: string;
  code: number;
}
