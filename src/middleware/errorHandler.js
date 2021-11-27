class RequestError extends Error {
  constructor(code, devMessage, userMessage = "Lỗi server, vui lòng thử lại!") {
    super(devMessage);

    this.code = code;
    this.userMessage = userMessage;
  }
}

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof RequestError) {
    return res.json({
      success: false,
      error: err.message,
      message: err.userMessage,
    });
  }

  return res.json({
    success: false,
    error: err.message,
    message: `Lỗi server [${err.message}]`,
  });
};

export default errorHandler;
