import { Request, Response } from 'express';
import { objectToSnake } from 'ts-case-convert/lib/caseConvert';

import recordService from './record.service';
import {
  createRequestSchema,
  deleteRequestSchema,
  getAllRequestSchema,
  getCurrentGoalsRequestSchema,
  getRequestSchema,
  updateRequestSchema,
  getStatisticsRequestSchema,
} from './record.validator';
import { validateRequest } from '../../utils/validation.util';
import recordDAO from './record.dao';
import { NotFoundError } from '../../errors/not-found.error';

export async function getRecord(req: Request, res: Response) {
  const {
    params: { recordId },
  } = await validateRequest(getRequestSchema, req, 'Invalid get request data');

  const record = await recordDAO.findById(req.session.user!.id, recordId);
  if (!record) {
    throw new NotFoundError(`Record with id=${recordId} not found`);
  }
  res.send(record);
}

export async function getAllRecords(req: Request, res: Response) {
  const { query } = await validateRequest(
    getAllRequestSchema,
    req,
    'Invalid get all records request data'
  );
  const records = await recordDAO.find(req.session.user!.id, query);
  res.status(200).json({ records });
}

export async function deleteRecord(req: Request, res: Response) {
  const {
    params: { recordId },
  } = await validateRequest(
    deleteRequestSchema,
    req,
    'Invalid delete request data'
  );
  const result = await recordDAO.remove(req.session.user!.id, recordId);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(
      `Failed to delete record. Record with id=${recordId} not found.`
    );
  }
  res.sendStatus(204);
}

export async function createRecord(req: Request, res: Response) {
  const { body } = await validateRequest(
    createRequestSchema,
    req,
    'Invalid create request data'
  );
  const newRecord = await recordDAO.create(
    req.session.user!.id,
    objectToSnake(body)
  );
  if (!newRecord) {
    throw new NotFoundError(
      `Failed to create record for specified activity. Activity with id=${body.activityId} not found.`
    );
  }
  res.status(201).json(newRecord);
}

export async function updateRecord(req: Request, res: Response) {
  const {
    body,
    params: { recordId },
  } = await validateRequest(
    updateRequestSchema,
    req,
    'Invalid update request data'
  );

  const updatedRecord = await recordDAO.update(
    req.session.user!.id,
    recordId,
    objectToSnake(body)
  );

  if (!updatedRecord) {
    throw new NotFoundError(`Failed to update - some reason`);
  }
  res.json({ updatedRecord });
}

export async function getCurrentGoals(req: Request, res: Response) {
  const {
    query: { timezoneOffset },
  } = await validateRequest(
    getCurrentGoalsRequestSchema,
    req,
    'invalid goal request query string 2'
  );

  const data = await recordDAO.findCurrentGoals(
    req.session.user!.id,
    timezoneOffset
  );
  res.status(200).json(data);
}

export async function getStatistics(req: Request, res: Response) {
  console.log('hi');
  console.log(req.query);
  const { query } = await validateRequest(
    getStatisticsRequestSchema,
    req,
    'bad get statistics request'
  );
  console.log('hi');
  const data = await recordService.getStatistics(req.session.user!.id, query);
  res.json(Object.fromEntries(data));
}
