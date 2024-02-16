import { CustomApiError } from './custom-api-error';

export class EmailError extends CustomApiError {
  constructor(message: string) {
    super(message, 500, 'EmailError');
  }
}
