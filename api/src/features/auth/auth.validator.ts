import { ZodError, ZodIssue, string, z } from 'zod';
import { BadRequestError } from '../../errors/bad-request.error';
import { JwtPayload } from 'jsonwebtoken';

const stringNonEmptySchema = z.string().trim().min(1, 'Required');

const emailSchema = stringNonEmptySchema.email();
const passwordSchema = z.string().min(8);

export const loginSchema = z.object({
  body: z.object({ email: emailSchema, password: passwordSchema }),
});

export const registerSchema = loginSchema;

export const verifyEmailSchema = z.object({
  body: z.object({
    token: stringNonEmptySchema.transform((token) => token.trim()),
  }),
});

export const resendVerificationCodeSchema = z.object({
  body: z.object({ email: emailSchema }),
});

export const forgotPasswordSchema = resendVerificationCodeSchema;

export const verifyRecoveryCodeSchema = z.object({
  body: z.object({
    token: stringNonEmptySchema.transform((token) => token.trim()),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: passwordSchema,
    token: stringNonEmptySchema.transform((token) => token.trim()),
  }),
});

const authJwtPayloadSchema = z.object({
  email: emailSchema,
  type: z.union([
    z.literal('Email verification'),
    z.literal('Reset password'),
    z.literal('Change password'),
  ]),
});

export function validateAuthJwt(token: JwtPayload | string | undefined) {
  const result = authJwtPayloadSchema.safeParse(token);
  if (!result.success) {
    throw new BadRequestError('Invalid jwt format');
  }
  return result.data;
}
