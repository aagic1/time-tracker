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

  // functions
  validateForm,
};
