import { Request, Response, NextFunction } from 'express';

class UnauthenticatedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthenticatedError';
    this.statusCode = 401;
  }
}

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.session);
  if (!req.session || !req.session.user) {
    // return next(
    //   new UnauthenticatedError('Unauthenticated, please log in first')
    // );
    return res
      .status(401)
      .json({ msg: 'Unauthenticated, please log in first' });
  }
  next();
}
