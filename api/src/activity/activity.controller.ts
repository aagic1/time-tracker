import { Request, Response } from 'express';

import activityDAO from './activity.dao';
import {
  validateUrlParam,
  validateCreatePayload,
  validateUpdatePayload,
} from './activity.validator';
import { NotFoundError } from '../errors/not-found.error';

export async function getAllActivities(req: Request, res: Response) {
  const activities = await activityDAO.findByAccountId(req.session.user!.id);
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  const activityId = validateUrlParam(req.params.activityId);
  const activity = await activityDAO.findByIdAndAccountId(
    activityId,
    req.session.user!.id
  );
  if (!activity) {
    throw new NotFoundError(`Activity with id ${activityId} not found`);
  }
  res.status(200).json({ activity });
}

export async function createActivity(req: Request, res: Response) {
  const activity = validateCreatePayload(req.body);
  const createdActivity = await activityDAO.create({
    ...activity,
    account_id: req.session.user!.id,
  });
  res.status(200).json({ activity: createdActivity });
}

export async function updateActivity(req: Request, res: Response) {
  const activityId = validateUrlParam(req.params.activityId);
  const activity = validateUpdatePayload(req.body);
  const updatedActivity = await activityDAO.update(
    activityId,
    req.session.user!.id,
    activity
  );
  res.status(200).json({ activity: updatedActivity });
}

export async function deleteActivity(req: Request, res: Response) {
  const activityId = validateUrlParam(req.params.activityId);
  console.log(await activityDAO.remove(activityId, req.session.user!.id));
  res.sendStatus(200);
}
