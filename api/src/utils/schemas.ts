import { infer, z } from 'zod';

export const intervalSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
  })
  .partial()
  .refine(({ hours, minutes, seconds }) => hours || minutes || seconds, {
    message: 'At least one field must be defined and greater than 0',
  });

export const colorSchema = z
  .string()
  .length(7)
  .regex(/^#[A-Fa-f0-9]{6}$/, 'String must match hexadecimal color code')
  .transform((reg) => reg.slice(1));

export const stringNonEmptySchema = z.string().trim().min(1, 'Required');

export const bigintStringSchema = stringNonEmptySchema.transform((val, ctx) => {
  try {
    const id = BigInt(val);
    if (id <= 0) {
      throw '';
    }
    return id;
  } catch (err) {
    console.log('zooooooooooooooooood', err);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide positive whole number',
    });
    return z.NEVER;
  }
});

// boolean as string "true" or "false"

export const dateWithoutTimeSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Enter the date in the format YYYY-MM-DD')
  .transform((dateString, ctx) => {
    const date = new Date(dateString);
    if (isNaN(date.getDate())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
      });
      return z.NEVER;
    }
    return date;
  });

export const booleanStringSchema = z
  .enum(['true', 'false'], {
    errorMap: () => ({
      message: 'Archived has to be either true or false.',
    }),
  })
  .transform((archived) => archived === 'true');
