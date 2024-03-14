import { Request, Response } from 'express';

import {
  createRequestSchema,
  updateRequestSchema,
  getRequestSchema,
  getAllRequestSchema,
  deleteRequestSchema,
} from './activity.validator';
import { validateRequest } from '../../utils/validation.util';
import activityService from './activity.service';

export async function getAllActivities(req: Request, res: Response) {
  const { query: filters } = await validateRequest(
    getAllRequestSchema,
    req,
    'Invalid request data: GET /activities'
  );
  const activities = await activityService.getAllActivities(req.session.user!.id, filters);
  res.status(200).json(activities);
}

export async function getActivity(req: Request, res: Response) {
  const {
    params: { activityName },
  } = await validateRequest(
    getRequestSchema,
    req,
    'Invalid request data: GET /activities/:activityName'
  );

  const activity = await activityService.getActivity(req.session.user!.id, activityName);
  res.status(200).json(activity);
}

export async function createActivity(req: Request, res: Response) {
  const { body: activityData } = await validateRequest(
    createRequestSchema,
    req,
    'Invalid request data: POST /activities'
  );

  const newActivity = await activityService.createActivity(req.session.user!.id, activityData);
  res.status(201).json(newActivity);
}

export async function updateActivity(req: Request, res: Response) {
  const {
    body: activityData,
    params: { activityName },
  } = await validateRequest(
    updateRequestSchema,
    req,
    'Invalid request data: PATCH /activities/:activityName'
  );
  const updatedActivity = await activityService.updateActivity(
    req.session.user!.id,
    activityName,
    activityData
  );

  res.status(200).json(updatedActivity);
}

export async function deleteActivity(req: Request, res: Response) {
  const {
    params: { activityName },
  } = await validateRequest(
    deleteRequestSchema,
    req,
    'Invalid request data: DELETE /activities/:activityName'
  );
  await activityService.deleteActivity(req.session.user!.id, activityName);

  res.sendStatus(204);
}
