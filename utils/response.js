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

const toUTC7 = (date) => {
  if (!date) return null;
  const utc7 = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000);
  return utc7.toISOString().replace('Z', '+07:00');
};

module.exports = {
  successResponse,
  errorResponse,
  toUTC7,
};
