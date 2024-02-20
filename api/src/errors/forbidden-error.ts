import { CustomApiError } from './custom-api-error';

export class ForbiddenError extends CustomApiError {
  constructor(message: string) {
    super(message, 403, 'ForbiddenError');
  }
}
