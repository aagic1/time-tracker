import { Request, Response } from 'express';

import activityDAO from './activity.dao';
import {
  validateUrlParam,
  validateCreatePayload,
  validateUpdatePayload,
} from './activity.validator';

export async function getAllActivities(req: Request, res: Response) {
  const activities = await activityDAO.findByAccountId(1n);
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  try {
    const activityId = validateUrlParam(req.params.activityId);
    const activity = await activityDAO.findByIdAndAccountId(activityId, 1n);
    res.status(200).json({ activity });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}

export async function createActivity(req: Request, res: Response) {
  try {
    const activity = validateCreatePayload(req.body);
    const createdActivity = await activityDAO.create({
      ...activity,
      account_id: 1n,
    });
    res.status(200).json({ activity: createdActivity });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(400).json({ msg: err });
    }
  }
}

export async function updateActivity(req: Request, res: Response) {
  try {
    const activityId = validateUrlParam(req.params.activityId);
    const activity = validateUpdatePayload(req.body);
    const updatedActivity = await activityDAO.update(activityId, 1n, activity);
    res.status(200).json({ activity: updatedActivity });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}

export async function deleteActivity(req: Request, res: Response) {
  try {
    const activityId = validateUrlParam(req.params.activityId);
    await activityDAO.remove(activityId, 1n);
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ msg: err.message });
    } else if (typeof err === 'string') {
      res.status(404).json({ msg: err });
    }
  }
}
