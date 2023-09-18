import { Request, Response, NextFunction } from 'express';
import { CustomApiError } from '../errors/custom-api-error';
import { DatabaseError } from 'pg';

export function errorHandler(
  error: CustomApiError | DatabaseError | Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomApiError) {
    console.log('custom error');
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        type: error.name,
        issues: error.issues,
      },
    });
  } else if (error instanceof DatabaseError) {
    console.log('DB error');
    res.json(error);
  } else if (error instanceof Error) {
    console.log('error');
    res.json({ error });
  } else if (typeof error === 'string') {
    console.log('string');
    res.json(error);
  }
}
