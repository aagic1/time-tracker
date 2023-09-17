import { CustomApiError } from './custom-api-error';
import { Issue } from './types';

export class NotFoundError extends CustomApiError {
  constructor(message: string, issues?: Issue[]) {
    super(message, 404, 'NotFoundError', issues);
  }
}
