import { z, ZodError } from 'zod';

const EmailVerificationSchema = z.object({
  code: z.string().uuid('Invalid code'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
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

  // functions
  validateForm,
};
