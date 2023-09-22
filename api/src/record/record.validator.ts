import { ZodError, date, z } from 'zod';
import { BadRequestError } from '../errors/bad-request.error';

const MAX_BIGINT_POSTGRES = 9223372036854775807n;

const stringNonEmptySchema = z.string().trim().min(1);

const dateWithoutTimeSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Invalid date format. Enter the date in the format YYYY-MM-DD'
  )
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

const bigintStringSchema = stringNonEmptySchema.transform((val, ctx) => {
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

const booleanStringSchema = z
  .enum(['true', 'false'], {
    errorMap: () => ({
      message: 'Archived has to be either true or false.',
    }),
  })
  .transform((archived) => archived === 'true');

const createRequestPayloadSchema = z
  .object({
    activityId: bigintStringSchema,
    comment: stringNonEmptySchema.nullable().optional(),
    startedAt: z.string().datetime(),
    stoppedAt: z.string().datetime().nullable().optional(),
    active: z.boolean().optional(),
  })
  .refine(
    ({ stoppedAt, active }) =>
      (!stoppedAt && (active === true || active === undefined)) ||
      (stoppedAt && active === false),
    'Active records must not specify time when they were stopped. Inactive records must specifiy time when they were stopped'
  );

const updateRequestPayloadSchema = z
  .object({
    activityId: bigintStringSchema,
    comment: stringNonEmptySchema.nullable().optional(),
    startedAt: z.string().datetime(),
    stoppedAt: z.string().datetime().nullable().optional(),
    active: z.boolean().optional(),
  })
  .partial()
  .refine(
    ({ stoppedAt, active }) =>
      (!stoppedAt && active === true) || (stoppedAt && active === false),
    'Active records must not specify time when they were stopped. Inactive records must specifiy time when they were stopped'
  );

const queryStringSchema = z
  .object({
    active: booleanStringSchema,
    comment: stringNonEmptySchema,
    activityId: bigintStringSchema,
    date: dateWithoutTimeSchema,
    dateFrom: dateWithoutTimeSchema,
    dateTo: dateWithoutTimeSchema,
  })
  .partial()
  .refine(({ dateFrom, dateTo }) => {
    if (dateFrom && dateTo && dateTo < dateFrom) {
      return false;
    }
    return true;
  });

export function validatePathParam(param: string) {
  const result = bigintStringSchema.safeParse(param);
  if (!result.success) {
    throw new BadRequestError(
      'Invalid path parameter. recordId has to be positive whole number'
    );
  }
  return result.data;
}

export function validateCreatePaylaod(payload: unknown) {
  const result = createRequestPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }
  return result.data;
}

export function validateUpdatePayload(payload: unknown) {
  const result = updateRequestPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }
  return result.data;
}

export function validateQueryString(query: unknown) {
  const result = queryStringSchema.safeParse(query);
  if (!result.success) {
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }
  return result.data;
}

function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
