type ErrorDetails = {
  message: string;
  field: string;
}[];

export class AppError extends Error {
  statusCode: number;
  isAppError = true;
  details: string | ErrorDetails;
  headers: Record<string, string | string[]>;
  constructor({
    name,
    statusCode,
    message,
    headers,
  }: {
    name: string;
    statusCode: number;
    message?: string | ErrorDetails;
    headers?: Record<string, string | string[]>;
  }) {
    super(name);
    this.statusCode = statusCode;
    this.name = name;
    this.details = message || "";
    this.headers = headers || {};
    Error.captureStackTrace(this, this.constructor);
  }
}
