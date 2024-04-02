import { Request, Response } from 'express';

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

export async function getRecord(req: Request, res: Response) {
  const {
    params: { recordId },
  } = await validateRequest(getRequestSchema, req, 'Invalid request data: GET /records/:recordId');

  const record = await recordService.getRecord(req.session.user!.id, recordId);
  res.status(200).json(record);
}

export async function getAllRecords(req: Request, res: Response) {
  const {
    query: { timezoneOffset, ...filters },
  } = await validateRequest(getAllRequestSchema, req, 'Invalid request data: GET /records');
  const records = await recordService.getAllRecords(req.session.user!.id, filters, timezoneOffset);
  res.status(200).json(records);
}

export async function deleteRecord(req: Request, res: Response) {
  const {
    params: { recordId },
  } = await validateRequest(
    deleteRequestSchema,
    req,
    'Invalid request data: DELETE /records/:recordId'
  );
  const success = await recordService.deleteRecord(req.session.user!.id, recordId);
  res.sendStatus(204);
}

export async function createRecord(req: Request, res: Response) {
  const { body: recordData } = await validateRequest(
    createRequestSchema,
    req,
    'Invalid request data: POST /records'
  );
  const newRecord = await recordService.createRecord(req.session.user!.id, recordData);
  res.status(201).json(newRecord);
}

export async function updateRecord(req: Request, res: Response) {
  const {
    body,
    params: { recordId },
  } = await validateRequest(
    updateRequestSchema,
    req,
    'Invalid request data: PATCH /records/:recordId'
  );

  const updatedRecord = await recordService.updateRecord(req.session.user!.id, recordId, body);
  res.json(updatedRecord);
}

export async function getCurrentGoals(req: Request, res: Response) {
  const {
    query: { timezoneOffset },
  } = await validateRequest(
    getCurrentGoalsRequestSchema,
    req,
    'Invalid request data: GET /records/goals'
  );

  const data = await recordService.getCurrentGoals(req.session.user!.id, timezoneOffset);
  res.status(200).json(data);
}

export async function getStatistics(req: Request, res: Response) {
  const {
    query: { timezoneOffset, ...filters },
  } = await validateRequest(
    getStatisticsRequestSchema,
    req,
    'Invalid request data: GET /records/statistics'
  );

  const data = await recordService.getStatistics(req.session.user!.id, filters, timezoneOffset);
  res.json(data);
}
