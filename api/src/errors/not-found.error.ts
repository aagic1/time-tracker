import { IApiError, Issue } from './types';

export class NotFoundError extends Error implements IApiError {
  statusCode: number;
  issues?: Issue[];

  constructor(message: string, issues?: Issue[]) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
    this.issues = issues;
  }
}
