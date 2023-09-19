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
    res
      .status(error.statusCode)
      .json({ error: { ...error, message: error.message } });
  } else if (error instanceof DatabaseError) {
    console.log('DB error');
    const dbError = parseDatabaseError(error);
    res.status(409).json({ error: dbError });
  } else if (error instanceof Error) {
    console.log('error');
    res.json({ error });
  } else if (typeof error === 'string') {
    console.log('string');
    res.json(error);
  }
}

const dbErrorCodes = {
  unique: '23505',
};

function parseDatabaseError(error: DatabaseError) {
  if (error.code === dbErrorCodes.unique) {
    console.log(error);
    let domainName =
      error.table!.charAt(0).toUpperCase() + error.table!.slice(1);
    let [sources, values] = error
      .detail!.split('=')
      .map((s) => {
        return s.slice(s.indexOf('(') + 1, s.indexOf(')'));
      })
      .map((s) => s.split(', '));
    return {
      type: 'ConflictError',
      message: `${domainName} with value(s) (${sources})=(${values}) already exists`,
    };
  } else {
    return 'Unhandled db error';
  }
}
