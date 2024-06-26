import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { JwtPayload } from 'jsonwebtoken';

import { stringNonEmptySchema } from '../../utils/schemas';

const emailSchema = stringNonEmptySchema.email();
const passwordSchema = z.string().min(8);

const loginSchema = z.object({
  body: z.object({ email: emailSchema, password: passwordSchema }),
});

const registerObject = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
};
const registerSchema = z.object(registerObject);
type Register = z.infer<typeof registerObject.body>;

const verifyEmailSchema = z.object({
  body: z.object({
    code: stringNonEmptySchema,
    email: emailSchema,
  }),
});

const resendVerificationCodeSchema = z.object({
  body: z.object({ email: emailSchema }),
});

const passwordRecoverySchema = z.object({
  body: z.object({ email: emailSchema }),
});

const verifyPasswordRecoverySchema = z.object({
  body: z.object({
    code: stringNonEmptySchema,
    email: emailSchema,
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
    newPassword: passwordSchema,
    code: stringNonEmptySchema,
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

function validateAuthJwt(token: JwtPayload | string | undefined) {
  const result = authJwtPayloadSchema.safeParse(token);
  if (!result.success) {
    throw new BadRequestError('Invalid jwt payload');
  }
  return result.data;
}

// ________
// public API
export {
  // schemas
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  resendVerificationCodeSchema,
  passwordRecoverySchema,
  verifyPasswordRecoverySchema,
  resetPasswordSchema,

  // types
  Register,

  // functions
  validateAuthJwt,
};
