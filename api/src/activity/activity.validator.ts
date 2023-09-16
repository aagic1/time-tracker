import { z } from 'zod';

import { toStringFromInterval } from './activity.utils';
import { ActivityUpdate } from '../db/types';

const activityIdParamSchema = z.coerce.bigint().min(1n);

const intervalSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
  })
  .partial()
  .refine(
    ({ hours, minutes, seconds }) =>
      hours != undefined || minutes != undefined || seconds != undefined,
    { message: 'At least one field must be defined' }
  )
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
  const result = activityIdParamSchema.safeParse(param);
  if (!result.success) {
    throw `Activity with id ${param} not found`;
  }
  return result.data;
}

export function validateUpdatePayload(payload: any) {
  const result = updateRequestPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw 'Invalid payload';
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
    throw 'Invalid payload';
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
