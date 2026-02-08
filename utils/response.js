const successResponse = (statusCode, message, data = null) => {
  return {
    status: "success",
    statusCode,
    message,
    data,
  };
};

const errorResponse = (statusCode, message, errors = null) => {
  return {
    status: "error",
    statusCode,
    message,
    errors,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
