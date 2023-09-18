import { CustomApiError } from './custom-api-error';
import { ValidationIssue } from './types';

export class UnauthenticatedError extends CustomApiError {
  constructor(message: string, issues?: ValidationIssue[]) {
    super(message, 401, 'UnauthenticatedError', issues);
  }
}
