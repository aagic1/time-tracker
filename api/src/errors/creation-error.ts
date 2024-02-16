import { CustomApiError } from './custom-api-error';

export class CreationError extends CustomApiError {
  constructor(message: string) {
    super(message, 500, 'CreationError');
  }
}
