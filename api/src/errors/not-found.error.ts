import { CustomApiError } from './custom-api-error';
import { ValidationIssue } from './types';

export class NotFoundError extends CustomApiError {
  constructor(message: string, issues?: ValidationIssue[]) {
    super(message, 404, 'NotFoundError', issues);
  }
}
