import { z, ZodError } from 'zod';

const EmailVerificationSchema = z.object({
  code: z.string().uuid('Invalid code'),
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

  // functions
  validateForm,
};
