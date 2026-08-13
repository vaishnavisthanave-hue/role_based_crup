const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError
} = require("sequelize");

const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {

  // Generate error log
  logger.error({
    message: err.message,
    code: err.code || "INTERNAL_ERROR",
    statusCode: err.statusCode || 500,

    method: req.method,
    url: req.originalUrl,

    userId: req.user?.id || null,

    ip: req.ip,

    stack: err.stack
  });


  // Sequelize validation error
  if (err instanceof ValidationError) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",

      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message
      }))
    });
  }


  // Duplicate database value
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value already exists",
      code: "DUPLICATE_ENTRY"
    });
  }


  // Foreign key error
  if (err instanceof ForeignKeyConstraintError) {

    return res.status(400).json({
      success: false,
      message: "Invalid related resource",
      code: "FOREIGN_KEY_ERROR"
    });
  }


  // Custom operational error
  if (err.isOperational) {

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }


  // Unknown/unexpected error
  return res.status(500).json({
    success: false,
    message: err.message,
    code: "INTERNAL_ERROR"
  });
};

module.exports = errorHandler;