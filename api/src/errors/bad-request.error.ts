import { CustomApiError } from './custom-api-error';
import { Issue } from './types';

export class BadRequestError extends CustomApiError {
  constructor(message: string, issues?: Issue[]) {
    super(message, 400, 'BadRequestError', issues);
  }
}
