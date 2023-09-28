import { Request, Response, NextFunction } from 'express';
import { CustomApiError } from '../errors/custom-api-error';
import { DatabaseError } from 'pg';

export function errorHandler(
  error: CustomApiError | DatabaseError | Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
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
    res.send(error.message);
  } else if (typeof error === 'string') {
    console.log('string');
    res.send(error);
  } else {
    console.log('unknown error');
    res.send('unknown error');
  }
}

const dbErrorCodes = {
  unique: '23505',
  foreignKey: '23503',
  outOfRangeNumeric: '22003',
};

function parseDatabaseErrorContents(error: DatabaseError) {
  let domainName = error.table!.charAt(0).toUpperCase() + error.table!.slice(1);
  let [sources, values] = error
    .detail!.split('=')
    .map((s) => {
      return s.slice(s.indexOf('(') + 1, s.indexOf(')'));
    })
    .map((s) => s.split(', '));
  return { domainName, sources, values };
}

function parseDatabaseError(error: DatabaseError) {
  if (error.code === dbErrorCodes.unique) {
    const { domainName, sources, values } = parseDatabaseErrorContents(error);
    return {
      type: 'ConflictError',
      message: `${domainName} with value(s) (${sources})=(${values}) already exists`,
    };
  } else if (error.code === dbErrorCodes.foreignKey) {
    const { domainName, sources, values } = parseDatabaseErrorContents(error);
    return {
      type: 'NotFoundError',
      message: `Key (${sources}): (${values}) doesn't exist`,
    };
  } else if (error.code === dbErrorCodes.outOfRangeNumeric) {
    return {
      type: 'NumericOutOfRangeError',
      message: `Some numeric value is out of range. This message is bad, should be more specific. But error doesn't give any info`,
    };
  } else {
    return 'Unhandled db error';
  }
}
