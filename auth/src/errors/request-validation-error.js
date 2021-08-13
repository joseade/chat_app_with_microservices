module.exports = class RequestValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.statusCode = 400;
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
};
