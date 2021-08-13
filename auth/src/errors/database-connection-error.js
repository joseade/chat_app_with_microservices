module.exports = class DatabaseConnectionError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.statusCode = 500;
    this.reason = "Error connecting to database";
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
};
