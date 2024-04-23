type ErrorDetails = {
  message: string;
  field: string;
}[];

export class AppError extends Error {
  isAppError = true;
  details: string | ErrorDetails;
  constructor(
    name: string,
    public statusCode: number,
    message?: string | ErrorDetails
  ) {
    super(name);
    this.statusCode = statusCode;
    this.name = name;
    this.details = message || "";
    Error.captureStackTrace(this, this.constructor);
  }
}
