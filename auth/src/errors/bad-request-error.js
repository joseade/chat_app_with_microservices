module.exports = class BadRequestError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.statusCode = 400;
  }

  serializeErrors() {
    return [{ message: this.errors }];
  }
};
