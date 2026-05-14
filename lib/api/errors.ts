export type AppErrorDetails = Record<string, unknown> | undefined;

export class AppError extends Error {
  code: string;
  status: number;
  details?: AppErrorDetails;

  constructor(
    code: string,
    message: string,
    status = 400,
    details?: AppErrorDetails,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
