import express, { Router, Request, Response } from 'express';

const activitiesRouter: Router = express.Router();

activitiesRouter
  .route('/')
  .get((req: Request, res: Response) => {
    res.send('Get activites');
  })
  .post((req: Request, res: Response) => {
    res.send('Create activity');
  });

activitiesRouter
  .route('/:activityId')
  .get((req: Request, res: Response) => {
    res.send('Get activity by id');
  })
  .patch((req: Request, res: Response) => {
    res.send('Update activity by id');
  })
  .delete((req: Request, res: Response) => {
    res.send('Delete activity by id');
  });

export default activitiesRouter;
