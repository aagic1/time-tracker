import { IApiError, Issue } from './types';

export class UnauthenticatedError extends Error implements IApiError {
  statusCode: number;
  issues?: Issue[];

  constructor(message: string, issues?: Issue[]) {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthenticatedError';
    this.issues = issues;
  }
}

let a = new UnauthenticatedError('hi');
