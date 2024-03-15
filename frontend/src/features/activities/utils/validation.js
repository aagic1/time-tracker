import { ZodError, z } from 'zod';

const intervalSchema = z.object({
  hours: z.number().int().min(0).max(99999),
  minutes: z.number().int().min(0).max(59),
  seconds: z.number().int().min(0).max(59),
});

const intervalSchemaNonZero = intervalSchema.transform(({ hours, minutes, seconds }) => {
  if (hours === 0 && minutes === 0 && seconds === 0) {
    return null;
  }
  return { hours, minutes, seconds };
});

const activitySchema = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character'),
  color: z
    .string()
    .length(7)
    .regex(/^#[A-Fa-f0-9]{6}$/, 'String must match hexadecimal color code'),
  sessionGoal: intervalSchemaNonZero.nullish(),
  dayGoal: intervalSchemaNonZero.nullish(),
  weekGoal: intervalSchemaNonZero.nullish(),
  monthGoal: intervalSchemaNonZero.nullish(),
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

export { validate, activitySchema };
