import { CustomApiError } from './custom-api-error';
import { ValidationIssue } from './types';

export class BadRequestError extends CustomApiError {
  constructor(message: string, issues?: ValidationIssue[]) {
    super(message, 400, 'BadRequestError', issues);
  }
}
