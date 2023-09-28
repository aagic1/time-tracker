import { Request, Response } from 'express';

import activityDAO from './activity.dao';
import {
  validatePathParam,
  validateCreatePayload,
  validateUpdatePayload,
  validateQueryStrings,
} from './activity.validator';
import { NotFoundError } from '../errors/not-found.error';

export async function getAllActivities(req: Request, res: Response) {
  const filters = validateQueryStrings(req.query);
  const activities = await activityDAO.findByAccountId(
    req.session.user!.id,
    filters
  );
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  const activityName = validatePathParam(req.params.activityName);

  const activity = await activityDAO.findByNameAndAccountId(
    activityName,
    req.session.user!.id
  );
  if (!activity) {
    throw new NotFoundError(`Activity with id ${activityName} not found`);
  }
  res.status(200).json({ activity });
}

export async function createActivity(req: Request, res: Response) {
  const activity = validateCreatePayload(req.body);
  const createdActivity = await activityDAO.create({
    ...activity,
    account_id: req.session.user!.id,
  });
  if (!createActivity) {
    throw `Failed to create activity. Server error`;
  }
  res.status(201).json({ activity: createdActivity });
}

export async function updateActivity(req: Request, res: Response) {
  const activityName = validatePathParam(req.params.activityName);
  const activity = validateUpdatePayload(req.body);
  const updatedActivity = await activityDAO.update(
    activityName,
    req.session.user!.id,
    activity
  );
  if (!updatedActivity) {
    throw `Failed to update activity. Server error`;
  }
  res.status(200).json({ activity: updatedActivity });
}

export async function deleteActivity(req: Request, res: Response) {
  const activityName = validatePathParam(req.params.activityName);
  const result = await activityDAO.remove(activityName, req.session.user!.id);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(
      `Failed to delete activity. Activity with name=${activityName} not found.`
    );
  }
  res.sendStatus(204);
}
