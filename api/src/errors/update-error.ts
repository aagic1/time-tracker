import { CustomApiError } from './custom-api-error';

export class UpdateError extends CustomApiError {
  constructor(message: string) {
    super(message, 500, 'UpdateError');
  }
}
