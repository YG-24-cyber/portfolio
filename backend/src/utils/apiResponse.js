/**
 * Standardized API Response Helper
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

export const apiResponse = {
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return sendSuccess(res, statusCode, message, data);
  },

  error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return sendError(res, statusCode, message, errors);
  },
};

export default apiResponse;
