import express, { Request, Response } from 'express';

const recordsRouter = express.Router();

recordsRouter
  .route('/')
  .get((req: Request, res: Response) => {
    res.send('Get all records');
  })
  .post((req: Request, res: Response) => {
    res.json(req.body);
  });

recordsRouter
  .route('/:recordId')
  .get((req: Request, res: Response) => {
    res.send('Get single record');
  })
  .patch((req: Request, res: Response) => {
    res.json(req.body);
  })
  .delete((req: Request, res: Response) => {
    res.send('Delete record');
  });

export default recordsRouter;
