import { CustomApiError } from './custom-api-error';
import { Issue } from './types';

export class UnauthenticatedError extends CustomApiError {
  constructor(message: string, issues?: Issue[]) {
    super(message, 401, 'UnauthenticatedError', issues);
  }
}
