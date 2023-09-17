import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('My custom error handler');
  if (error instanceof Error) {
    res.status(400).json({ msg: error.message });
  } else if (typeof error === 'string') {
    res.status(400).json({ msg: error });
  }
}
