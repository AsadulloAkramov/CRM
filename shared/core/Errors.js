class Errors {
  constructor() {
    this.FORBIDDEN_MESSAGE = 'Forbidden';
    this.UNAUTHORIZED_MESSAGE = 'Unauthorized';
    this.NOT_FOUND_MESSAGE = 'Not Found';
    this.INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
    this.ALREADY_EXISTS_MESSAGE = 'Already Exists';
  }

  forbidden() {
    throw new Error(this.FORBIDDEN_MESSAGE);
  }

  unauthorized() {
    throw new Error(this.UNAUTHORIZED_MESSAGE);
  }

  notFound() {
    throw new Error(this.NOT_FOUND_MESSAGE);
  }

  internalServerError() {
    throw new Error(this.INTERNAL_SERVER_ERROR_MESSAGE);
  }

  alreadyExists() {
    throw new Error(this.ALREADY_EXISTS_MESSAGE);
  }
}

module.exports = Errors;
