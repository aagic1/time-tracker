import { CustomApiError } from './custom-api-error';

export class WrongPasswordError extends CustomApiError {
  constructor(message: string) {
    super(message, 422, 'WrongPasswordError');
  }
}
