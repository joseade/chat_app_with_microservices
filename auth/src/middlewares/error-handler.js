const RequestValidationError = require("../errors/request-validation-error");
const DatabaseConnectionError = require("../errors/database-connection-error");
const BadRequestError = require("../errors/bad-request-error");
const NotAuthorizedError = require("../errors/not-authorized-error");

const NotFoundError = require("../errors/not-found-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof NotAuthorizedError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(err.statusCode).json({ message: err });
};

module.exports = errorHandler;
