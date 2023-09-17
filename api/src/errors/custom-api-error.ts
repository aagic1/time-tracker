import { Issue } from './types';

export abstract class CustomApiError extends Error {
  name: string;
  statusCode: number;
  issues?: Issue[];

  constructor(
    message: string,
    statusCode: number,
    name: string,
    issues?: Issue[]
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.issues = issues?.map((issue) => {
      return { path: issue.path, message: issue.message };
    });
  }
}
