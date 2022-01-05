const ResponseTypes = Object.freeze({
  notFound: 'NOT_FOUND',
  success: 'SUCCESS',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  fail: 'INTERNAL_SERVER_ERROR',
  exists: 'ALREADY_EXISTS',
  invalidInputValue: 'INVALID_INPUT_VALUE',
  noContent: 'NO_CONTENT',
  notModified: 'NOT_MODIFIED',
  paymentRequired: 'PAYMENT_REQUIRED',
  conflict: 'CONFLICT',
  unsupportedMediaType: 'UNSUPPORTED_MEDIA_TYPE',
  tooManyRequests: 'TOO_MANY_REQUESTS',
  serviceUnavailable: 'SERVICE_UNAVAILABLE',
  validationError: 'VALIDATION_ERROR'
});

module.exports = { ResponseTypes };
