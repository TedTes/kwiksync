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
  validation(message: string, errorCode?: number, details?: any) {
    return new CustomError(
      ErrorTypes.VALIDATION_ERROR,
      message,
      errorCode || 400,
      details
    ).toJSON();
  },

  authentication(
    message: string = "Authentication failed",
    errorCode?: number
  ) {
    return new CustomError(
      ErrorTypes.AUTHENTICATION_ERROR,
      message,
      errorCode || 401
    );
  },

  authorization(message: string = "Not authorized", errorCode?: number) {
    return new CustomError(
      ErrorTypes.AUTHORIZATION_ERROR,
      message,
      errorCode || 403
    );
  },

  notFound(message: string = "Resource not found", errorCode?: number) {
    return new CustomError(
      ErrorTypes.NOT_FOUND_ERROR,
      message,
      errorCode || 404
    );
  },

  conflict(message: string, errorCode?: number) {
    return new CustomError(
      ErrorTypes.CONFLICT_ERROR,
      message,
      errorCode || 409
    );
  },

  rateLimit(message: string = "Too many requests", errorCode?: number) {
    return new CustomError(
      ErrorTypes.RATE_LIMIT_ERROR,
      message,
      errorCode || 429
    );
  },

  server(message: string = "Internal server error", errorCode?: number) {
    return new CustomError(ErrorTypes.SERVER_ERROR, message, errorCode || 500);
  },
};
