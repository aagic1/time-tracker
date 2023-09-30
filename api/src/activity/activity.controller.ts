import { Request, Response } from 'express';
import { objectToSnake } from 'ts-case-convert';

import activityDAO from './activity.dao';
import {
  createRequestSchema,
  updateRequestSchema,
  getRequestSchema,
  deleteRequestSchema,
  getAllRequestSchema,
} from './activity.validator';
import { NotFoundError } from '../errors/not-found.error';
import { validateRequest } from '../utils/validation.util';

export async function getAllActivities(req: Request, res: Response) {
  const { query } = await validateRequest(
    getAllRequestSchema,
    req,
    'Invalid get all request data'
  );
  const activities = await activityDAO.findByAccountId(
    req.session.user!.id,
    query
  );
  res.status(200).json({ activities });
}

export async function getActivity(req: Request, res: Response) {
  const {
    params: { activityName },
  } = await validateRequest(getRequestSchema, req, 'Invalid get request data');

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
  const { body } = await validateRequest(
    createRequestSchema,
    req,
    'Invalid create request data'
  );

  const createdActivity = await activityDAO.create(
    objectToSnake({ ...body, accountId: req.session.user!.id })
  );
  if (!createActivity) {
    throw `Failed to create activity. Server error`;
  }
  res.status(201).json({ activity: createdActivity });
}

export async function updateActivity(req: Request, res: Response) {
  const { body, params } = await validateRequest(
    updateRequestSchema,
    req,
    'Invalid update request data'
  );
  const updatedActivity = await activityDAO.update(
    params.activityName,
    req.session.user!.id,
    objectToSnake(body)
  );
  if (!updatedActivity) {
    throw `Failed to update activity. Server error`;
  }
  res.status(200).json({ activity: updatedActivity });
}

export async function deleteActivity(req: Request, res: Response) {
  const {
    params: { activityName },
  } = await validateRequest(
    deleteRequestSchema,
    req,
    'Invalid delete request data'
  );
  const result = await activityDAO.remove(activityName, req.session.user!.id);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(
      `Failed to delete activity. Activity with name=${activityName} not found.`
    );
  }
  res.sendStatus(204);
}
