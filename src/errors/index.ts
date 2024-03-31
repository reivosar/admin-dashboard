export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends APIError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class NotFoundError extends APIError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends APIError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServerError extends APIError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
