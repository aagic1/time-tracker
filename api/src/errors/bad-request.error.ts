import { IApiError, Issue } from './types';

class BadRequestError extends Error implements IApiError {
  statusCode: number;
  issues?: Issue[];

  constructor(message: string, issues?: Issue[]) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
    this.issues = issues;
  }
}
