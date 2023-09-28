import { ZodError, ZodIssue, z } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error';
import { JwtPayload } from 'jsonwebtoken';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = loginSchema;

const verificationJwtSchema = z.object({
  email: z.string().email(),
});

const resendConfirmationEmailSchema = z.object({ email: z.string().email() });

export function validateResendConfirmationPayload(payload: unknown) {
  const result = resendConfirmationEmailSchema.safeParse(payload);
  if (!result.success) {
    throw 'error send verification code validation';
  }
  return result.data;
}

export function validateVerificationJwt(
  token: JwtPayload | string | undefined
) {
  const result = verificationJwtSchema.safeParse(token);
  if (!result.success) {
    throw new BadRequestError('Invalid jwt format');
  }
  return result.data;
}

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
