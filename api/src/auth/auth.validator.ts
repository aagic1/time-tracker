import { ZodError, ZodIssue, string, z } from 'zod';
import { BadRequestError } from '../errors/bad-request.error';
import { JwtPayload } from 'jsonwebtoken';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export const loginSchema = z.object({
  body: z.object({ email: emailSchema, password: passwordSchema }),
});

export const registerSchema = loginSchema;

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().transform((token) => token.trim()),
  }),
});

export const resendVerificationCodeSchema = z.object({
  body: z.object({ email: z.string().email() }),
});

export const forgotPasswordSchema = resendVerificationCodeSchema;

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: passwordSchema,
    token: string().transform((token) => token.trim()),
  }),
});

const authJwtSchema = z.object({
  email: z.string().email(),
  type: z.union([z.literal('Email verification'), z.literal('Reset password')]),
});

export function validateAuthJwt(token: JwtPayload | string | undefined) {
  const result = authJwtSchema.safeParse(token);
  if (!result.success) {
    throw new BadRequestError('Invalid jwt format');
  }
  return result.data;
}
