import { ZodError, z } from 'zod';

import { toStringFromInterval } from './activity.utils';
import { BadRequestError } from '../errors/bad-request.error';

const activityIdParamSchema = z.coerce.bigint().positive();
const activityNameParamSchema = z.string().min(1);

const queryStringsSchema = z
  .object({
    archived: z
      .enum(['true', 'false'], {
        errorMap: () => ({
          message: 'Archived has to be either true or false.',
        }),
      })
      .transform((archived) => archived === 'true'),
  })
  .partial();

const intervalSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
  })
  .partial()
  .refine(({ hours, minutes, seconds }) => hours || minutes || seconds, {
    message: 'At least one field must be defined and greater than 0',
  })
  .nullable()
  .optional();

const createRequestPayloadSchema = z.object({
  name: z.string().min(1),
  color: z.string().length(6),
  sessionGoal: intervalSchema.transform((val) => toStringFromInterval(val)),
  dayGoal: intervalSchema.transform((val) => toStringFromInterval(val)),
  weekGoal: intervalSchema.transform((val) => toStringFromInterval(val)),
  monthGoal: intervalSchema.transform((val) => toStringFromInterval(val)),
});

const updateRequestPayloadSchema = createRequestPayloadSchema
  .partial({
    name: true,
    color: true,
  })
  .merge(z.object({ archived: z.boolean().optional() }));

export function validateUrlParam(param: string) {
  const result = activityNameParamSchema.safeParse(param);
  if (!result.success) {
    console.log(result.error);
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }
  return result.data;
}

export function validateUpdatePayload(payload: any) {
  const result = updateRequestPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }

  const activity = result.data;
  return {
    color: activity.color,
    name: activity.name,
    archived: activity.archived,
    session_goal: activity.sessionGoal,
    day_goal: activity.dayGoal,
    week_goal: activity.weekGoal,
    month_goal: activity.monthGoal,
  };
}

export function validateCreatePayload(payload: any) {
  const result = createRequestPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid data', extractIssues(result.error));
  }

  const activity = result.data;
  return {
    color: activity.color,
    name: activity.name,
    session_goal: activity.sessionGoal,
    day_goal: activity.dayGoal,
    week_goal: activity.weekGoal,
    month_goal: activity.monthGoal,
  };
}

export function validateQueryStrings(query: unknown) {
  const result = queryStringsSchema.safeParse(query);
  if (!result.success) {
    throw new BadRequestError(
      'Invalid query string data',
      extractIssues(result.error)
    );
  }
  return result.data;
}

function extractIssues(error: ZodError) {
  return error.issues.map(({ message, path }) => {
    return { message, path };
  });
}
