class Response {
  static set(type, message, data) {
    return {
      code: type,
      message,
      data
    };
  }

  static notFound(message = 'Not Found', data = null) {
    return {
      code: 'NOT_FOUND',
      message,
      data
    };
  }

  static forbidden(data = null, message = 'Forbidden') {
    return {
      code: 'FORBIDDEN',
      message,
      data
    };
  }

  static unauthorized(data = null, message = 'Unauthorized') {
    return {
      code: 'UNAUTHORIZED',
      message,
      data
    };
  }

  static success(data = null, message = 'Success') {
    return {
      code: 'SUCCESS',
      message,
      data
    };
  }

  static fail(message = 'Internal Server Error', data = null) {
    return {
      code: 'INTERNAL_SERVER_ERROR',
      message,
      data
    };
  }

  static exists(data = null, message = 'This item already exists') {
    return {
      code: 'ALREADY_EXISTS',
      message,
      data
    };
  }
}
module.exports = Response;
