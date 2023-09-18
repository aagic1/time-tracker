import { Request, Response, NextFunction } from 'express';
import { CustomApiError } from '../errors/custom-api-error';
import { DatabaseError } from 'pg';

const dbErrorCodes = {
  unique: '23505',
};

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

    if (error.code === dbErrorCodes.unique) {
      let [source, value] = error.detail!.split('=').map((s) => {
        return s.slice(s.indexOf('(') + 1, s.indexOf(')'));
      });
      source = source.charAt(0).toUpperCase() + source.slice(1);
      res.status(409).json({
        error: {
          type: 'ConflictError',
          message: `${source} with value ${value} already exists`,
        },
      });
    } else {
      res.status(400).json(error);
    }
  } else if (error instanceof Error) {
    console.log('error');
    res.json({ error });
  } else if (typeof error === 'string') {
    console.log('string');
    res.json(error);
  }
}
