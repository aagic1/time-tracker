import { Request, Response } from 'express';

import { validatePathParam } from './record.validator';
import recordDAO from './record.dao';
import { NotFoundError } from '../errors/not-found.error';

export async function getRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const record = await recordDAO.findById(BigInt(req.params.recordId));
  if (!record) {
    throw new NotFoundError(`Record with id=${recordId} not found`);
  }
  res.send(record);
}

export async function getAllRecords(req: Request, res: Response) {
  const records = await recordDAO.find(req.session.user!.id);
  res.status(200).json({ records });
}

export async function deleteRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const result = await recordDAO.remove(recordId);
  if (result.numDeletedRows === 0n) {
    res.status(404).send({ msg: 'Record not found' });
  }
  res.status(204).send({ msg: 'Record deleted successfully' });
}

export async function createRecord(req: Request, res: Response) {
  const record = await recordDAO.create(req.body);
  console.log(record);
  res.status(201).json(record);
}

export async function updateRecord(req: Request, res: Response) {
  const recordId = validatePathParam(req.params.recordId);
  const record = await recordDAO.update(recordId, {
    ...req.body,
    started_at: new Date(req.body.started_at),
    stopped_at: new Date(req.body.stopped_at),
  });
  console.log(record);
  res.json({ record });
}
