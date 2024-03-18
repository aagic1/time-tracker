import { ZodError, z } from 'zod';

const RecordSchema = z.object({
  activityId: z.string(),
  startedAt: z.date(),
  stoppedAt: z.date().optional(),
});

function validate(values, schema) {
  try {
    return { success: true, data: schema.parse(values) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: error.formErrors.fieldErrors };
    }
  }
}

export { validate, RecordSchema };
