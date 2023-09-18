import { ValidationIssue, ResponseIssue } from './types';

export abstract class CustomApiError extends Error {
  name: string;
  statusCode: number;
  issues?: ResponseIssue[];

  constructor(
    message: string,
    statusCode: number,
    name: string,
    issues?: ValidationIssue[]
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.issues = issues?.map((issue) => {
      return { source: issue.path.join('.'), reason: issue.message };
    });
  }
}
