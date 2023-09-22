import { ZodError, z } from 'zod';
import { BadRequestError } from '../errors/bad-request.error';

const MAX_BIGINT_POSTGRES = 9223372036854775807n;
const recordIdParamSchema = z.coerce.bigint().positive();

const createRequestPayloadSchema = z.object({
  activityId: z.string().transform((val, ctx) => {
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
        message: 'Id has to be positive whole number',
      });
      return z.NEVER;
    }
  }),
  comment: z.string().nullable().optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime().nullable().optional(),
  active: z.boolean().optional(),
});

const updateRequestPayloadSchema = createRequestPayloadSchema.partial();

export function validatePathParam(param: string) {
  try {
    const result = recordIdParamSchema.safeParse(param);
    if (!result.success) {
      throw new BadRequestError(
        'Invalid path parameter. recordId has to be positive whole number'
      );
    }
    return result.data;
  } catch (err) {
    console.log(err);
    throw new BadRequestError(
      'Invalid path parameter. recordId has to be positive whole number'
    );
  }
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

function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
