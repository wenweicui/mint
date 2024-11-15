import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { NODE_ENV } from '../config/environment';

export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
}; 