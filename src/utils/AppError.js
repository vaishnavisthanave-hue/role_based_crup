const AppError = (
  message,
  statusCode = 500,
  code = "INTERNAL_ERROR"
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;

  Error.captureStackTrace(error, AppError);

  return error;
};

module.exports = AppError;