module.exports = class DatabaseConnectionError extends Error {
  constructor() {
    super();
    this.statusCode = 401;
  }
  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
};
