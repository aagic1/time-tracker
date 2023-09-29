import { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';
import { BadRequestError } from '../errors/bad-request.error';

export async function validateRequest<T extends AnyZodObject>(
  schema: T,
  req: Request,
  errorMessage: string
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError(errorMessage, extractIssues(error));
    }
    console.log('Non ZodError inside Zod validation');
    throw error;
  }
}

function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
