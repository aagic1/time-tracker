import { Request, Response, NextFunction } from 'express';
import { CustomApiError } from '../errors/custom-api-error';

export function errorHandler(
  error: Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomApiError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        type: error.name,
        issues: error.issues,
      },
    });
  } else if (error instanceof Error) {
    res.json({ error });
  } else if (typeof error === 'string') {
    res.json(error);
  }
}
