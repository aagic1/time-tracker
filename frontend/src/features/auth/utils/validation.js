import { z, ZodError } from 'zod';

const EmailVerificationSchema = z.object({
  code: z.string().uuid('Invalid code'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordConfirmationSchema = z.object({
  code: z.string().uuid('Invalid code'),
});

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must have at least 8 characters'),
    passwordRepeat: z.string(),
  })
  .refine(({ password, passwordRepeat }) => passwordRepeat === password, {
    path: ['passwordRepeat'],
    message: 'Passwords do not match',
  });

function validateForm(values, schema) {
  try {
    schema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export {
  // validation schemas
  EmailVerificationSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ForgotPasswordConfirmationSchema,
  ResetPasswordSchema,

  // functions
  validateForm,
};
