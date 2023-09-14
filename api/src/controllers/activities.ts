import { Request, Response } from 'express';
import parse, { IPostgresInterval } from 'postgres-interval';
import activityDAO from '../data-access/activities';
import { ActivityUpdate, NewActivity } from '../db/types';
import { z } from 'zod';

interface GoalInterval {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface ICreateActivityRequestBody {
  name: string;
  color: string;
  sessionGoal?: GoalInterval;
  dayGoal?: GoalInterval;
  weekGoal?: GoalInterval;
  monthGoal?: GoalInterval;
}

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
  );

const createRequestPayloadSchema = z.object({
  name: z.string().min(1),
  color: z.string().length(6),
  sessionGoal: intervalSchema
    .optional()
    .transform((val) => toStringFromInterval(val)),
  dayGoal: intervalSchema
    .optional()
    .transform((val) => toStringFromInterval(val)),
  weekGoal: intervalSchema
    .optional()
    .transform((val) => toStringFromInterval(val)),
  monthGoal: intervalSchema
    .optional()
    .transform((val) => toStringFromInterval(val)),
});

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
    return res.status(400).json({ msg: 'Invalid payload' });
  }
  const activity = result.data;

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
  const result = activityIdParamSchema.safeParse(req.params.activityId);
  if (!result.success) {
    return res
      .status(404)
      .json({ msg: `No activity with id ${req.params.activityId}` });
  }
  const activityId = result.data;

  try {
    const activity = validateUpdateBodyAndReturn(req.body);
    const newActivity = await activityDAO.update(activityId, 1, activity);
    res.status(200).json({ activity: newActivity });
  } catch (e) {
    res.status(404).json({ msg: e });
  }
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

function toStringFromInterval(interval: GoalInterval | undefined) {
  if (!interval) {
    return interval;
  }
  return `${interval.hours ?? '00'}:${interval.minutes ?? '00'}:${
    interval.seconds ?? '00'
  }`;
}

function validateUpdateBodyAndReturn(
  arg: any
): Omit<ActivityUpdate, 'id' | 'account_id'> {
  if (arg.color !== undefined && arg.color.length !== 6) {
    throw 'Invalid color string';
  }
  if (arg.name !== undefined && arg.name.length === 0) {
    throw 'Enter name';
  }
  if (arg.archived !== undefined && typeof arg.archived !== 'boolean') {
    throw 'Archived must be either true or false';
  }
  if (
    /*arg.day_goal !== undefined && */ arg.day_goal !== null &&
    !isValidInterval(arg.day_goal)
  ) {
  }
  if (
    /*arg.session_goal !== undefined && */ arg.session_goal !== null &&
    !isValidInterval(arg.session_goal)
  ) {
  }
  if (
    /*arg.week_goal !== undefined && */ arg.week_goal !== null &&
    !isValidInterval(arg.week_goal)
  ) {
  }
  if (
    /*arg.month_goal !== undefined && */ arg.month_goal !== null &&
    !isValidInterval(arg.month_goal)
  ) {
  }
  return {
    color: arg.color,
    name: arg.name,
    archived: arg.archived,
    day_goal: toStringFromInterval(arg.day_goal),
    month_goal: toStringFromInterval(arg.month_goal),
    session_goal: toStringFromInterval(arg.session_goal),
    week_goal: toStringFromInterval(arg.week_goal),
  };
}

function areValidHours(hours: number): boolean {
  if (!Number.isInteger(hours)) {
    throw 'Hours must be whole number';
  }
  if (hours < 0) {
    throw 'Hours must be positive';
  }
  return true;
}

function areValidMinutesOrSeconds(minutesOrSeconds: number): boolean {
  if (!Number.isInteger(minutesOrSeconds)) {
    throw 'Minutes and seconds must be whole number';
  }
  if (minutesOrSeconds < 0 || minutesOrSeconds > 59) {
    throw 'Minutes and seconds must be between 0 and 59';
  }
  return true;
  //   return (
  //     Number.isInteger(minutesOrSeconds) &&
  //     minutesOrSeconds >= 0 &&
  //     minutesOrSeconds < 60
  //   );
}

function isValidInterval(interval?: GoalInterval): interval is GoalInterval {
  if (!interval) {
    return true;
  }

  const { hours, minutes, seconds } = interval;
  if (!hours && !minutes && !seconds) {
    throw 'At least one property of interval must be set';
    // return false;
  }
  if (hours && !areValidHours(hours)) {
    // return false;
  }
  if (minutes && !areValidMinutesOrSeconds(minutes)) {
    // return false;
  }
  if (seconds && !areValidMinutesOrSeconds(seconds)) {
    // return false;
  }

  return true;
}
