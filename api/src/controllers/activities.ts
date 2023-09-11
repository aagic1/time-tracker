import { Request, Response } from 'express';
import { Activity } from 'kysely-codegen';
import activityDAO from '../data-access/activities';

export async function getAllActivities(req: Request, res: Response) {
  const activities = await activityDAO.findByAccountId(1);
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  const activity = await activityDAO.findById(1, 1);
  res.status(200).json({ activity });
}
