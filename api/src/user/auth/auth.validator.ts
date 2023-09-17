import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);
const userNameSchema = z.string().min(3);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = loginSchema.merge(
  z.object({ username: userNameSchema })
);

export function validateLoginPayload(payload: unknown) {
  const result = loginSchema.safeParse(payload);
  if (!result.success) {
    throw 'Invalid email or password';
  }
  return result.data;
}

export function validateRegisterPayload(payload: unknown) {
  const result = registerSchema.safeParse(payload);
  if (!result.success) {
    throw 'Invalid email, username or password';
  }
  return result.data;
}
