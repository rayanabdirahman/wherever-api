import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import ApiResponse from '../utilities/api-response';
import logger from '../utilities/logger';

const ApiErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    const message = error.inner.message ? error.inner.message : error;
    logger.error(
      `[ApiErrorHandler] - Unable to reach to api route: ${message}`
    );
    return ApiResponse.error(res, message, error.status);
  }

  next();
};

export default ApiErrorHandler;
