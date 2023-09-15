import { Request, Response } from 'express';
import activityDAO from './activity.dao';
import { GoalInterval } from './activity.types';
import { z } from 'zod';

const activityIdParamSchema = z.coerce.number().min(1);

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

// router handlers
export async function getAllActivities(req: Request, res: Response) {
  const activities = await activityDAO.findByAccountId(1);
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  const result = activityIdParamSchema.safeParse(req.params.activityId);
  if (!result.success) {
    return res
      .status(404)
      .json({ msg: `No activity with id ${req.params.activityId}` });
  }
  const activityId = result.data;
  const activity = await activityDAO.findByIdAndAccountId(activityId, 1);
  res.status(200).json({ activity });
}

export async function createActivity(req: Request, res: Response) {
  const result = createRequestPayloadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ msg: 'Invalid payload' }); // this should further be clarified, use zod error mesages
  }
  const activity = result.data;

  // use function or library to convert from camelCase keys to snake_case
  const newActivity = await activityDAO.create({
    account_id: 1,
    color: activity.color,
    name: activity.name,
    session_goal: activity.sessionGoal,
    day_goal: activity.dayGoal,
    week_goal: activity.weekGoal,
    month_goal: activity.monthGoal,
  });
  res.status(200).json(newActivity);
}

export async function updateActivity(req: Request, res: Response) {
  const resultParam = activityIdParamSchema.safeParse(req.params.activityId);
  if (!resultParam.success) {
    return res
      .status(404)
      .json({ msg: `No activity with id ${req.params.activityId}` });
  }
  const activityId = resultParam.data;

  const resultPayload = updateRequestPayloadSchema.safeParse(req.body);
  if (!resultPayload.success) {
    return res.status(404).json({ msg: 'Invalid payload' }); // this should further be clarified, use zod error mesages. Current message is unclear
  }

  const activity = resultPayload.data;
  // use function or library to convert from camelCase keys to snake_case
  const newActivity = await activityDAO.update(activityId, 1, {
    color: activity.color,
    name: activity.name,
    archived: activity.archived,
    session_goal: activity.sessionGoal,
    day_goal: activity.dayGoal,
    week_goal: activity.weekGoal,
    month_goal: activity.monthGoal,
  });
  res.status(200).json({ activity: newActivity });
}

export async function deleteActivity(req: Request, res: Response) {
  const result = activityIdParamSchema.safeParse(req.params.activityId);
  if (!result.success) {
    return res
      .status(404)
      .json({ msg: `No activity with id ${req.params.activityId}` });
  }
  const activityId = result.data;
  try {
    await activityDAO.remove(activityId, 1);
  } catch (e) {
    return res
      .status(404)
      .json({ msg: `Activity with id ${activityId} not found` });
  }
  res.sendStatus(200);
}

// util -> should be moved to separate file
function toStringFromInterval(interval: GoalInterval | undefined | null) {
  if (!interval) {
    return interval;
  }
  return `${interval.hours ?? '00'}:${interval.minutes ?? '00'}:${
    interval.seconds ?? '00'
  }`;
}
