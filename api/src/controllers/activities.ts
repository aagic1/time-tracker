import { Request, Response } from 'express';
import { Activity } from 'kysely-codegen';
import activityDAO from '../data-access/activities';

export async function getAllActivities(req: Request, res: Response) {
  const activities = await activityDAO.findByAccountId(1);
  res.status(200).json({ activities });
}
