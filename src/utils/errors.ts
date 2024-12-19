export class CustomError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(
    code: string,
    message: string,
    status: number = 400,
    details?: any
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

// Common error types
export const ErrorTypes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

// Error factory for common error cases
export const ErrorFactory = {
  validation(message: string, details?: any) {
    return new CustomError(ErrorTypes.VALIDATION_ERROR, message, 400, details);
  },

  authentication(message: string = "Authentication failed") {
    return new CustomError(ErrorTypes.AUTHENTICATION_ERROR, message, 401);
  },

  authorization(message: string = "Not authorized") {
    return new CustomError(ErrorTypes.AUTHORIZATION_ERROR, message, 403);
  },

  notFound(message: string = "Resource not found") {
    return new CustomError(ErrorTypes.NOT_FOUND_ERROR, message, 404);
  },

  conflict(message: string) {
    return new CustomError(ErrorTypes.CONFLICT_ERROR, message, 409);
  },

  rateLimit(message: string = "Too many requests") {
    return new CustomError(ErrorTypes.RATE_LIMIT_ERROR, message, 429);
  },

  server(message: string = "Internal server error") {
    return new CustomError(ErrorTypes.SERVER_ERROR, message, 500);
  },
};
