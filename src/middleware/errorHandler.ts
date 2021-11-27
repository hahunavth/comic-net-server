import { NextFunction, Request, Response } from "express";

class RequestError extends Error {

  code
  userMessage

  constructor(code: any, devMessage: any, userMessage = "Lỗi server, vui lòng thử lại!") {
    super(devMessage);

    this.code = code;
    this.userMessage = userMessage;
  }
}

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
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
