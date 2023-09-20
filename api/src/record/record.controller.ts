import { Request, Response } from 'express';

import recordDAO from './record.dao';

export async function getRecord(req: Request, res: Response) {
  res.send(await recordDAO.findById());
}

export async function getAllRecords(req: Request, res: Response) {
  res.send(await recordDAO.find());
}

export async function deleteRecord(req: Request, res: Response) {
  res.send(await recordDAO.remove());
}

export async function createRecord(req: Request, res: Response) {
  res.send(await recordDAO.create());
}

export async function updateRecord(req: Request, res: Response) {
  res.send(await recordDAO.update());
}
