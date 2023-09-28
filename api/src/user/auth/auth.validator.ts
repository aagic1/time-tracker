import { ZodError, ZodIssue, z } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = loginSchema;


export function validateLoginPayload(payload: unknown) {
  const result = loginSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError(
      'Invalid login data',
      extractIssues(result.error)
    );
  }
  return result.data;
}

export function validateRegisterPayload(payload: unknown) {
  const result = registerSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError(
      'Invalid register data',
      extractIssues(result.error)
    );
  }
  return result.data;
}

// later move to separate utils file, or maybe shared utils file if necessary
function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
