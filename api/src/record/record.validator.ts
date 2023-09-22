import { ZodError, z } from 'zod';
import { BadRequestError } from '../errors/bad-request.error';

const MAX_BIGINT_POSTGRES = 9223372036854775807n;

const recordIdParamSchema = z.coerce.bigint().positive();

export function validatePathParam(param: string) {
  try {
    const result = recordIdParamSchema.safeParse(param);
    if (!result.success) {
      throw new BadRequestError(
        'Invalid path parameter. recordId has to be positive whole number'
      );
    }
    return result.data;
  } catch (err) {
    console.log(err);
    throw new BadRequestError(
      'Invalid path parameter. recordId has to be positive whole number'
    );
  }
}

function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
