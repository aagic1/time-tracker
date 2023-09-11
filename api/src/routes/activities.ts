import express, { Router, Request, Response } from 'express';
import { getAllActivities, getActivity } from '../controllers/activities';

const activitiesRouter: Router = express.Router();

activitiesRouter
  .route('/')
  .get(getAllActivities)
  .post((req: Request, res: Response) => {
    res.send('Create activity');
  });

activitiesRouter
  .route('/:activityId')
  .get(getActivity)
  .patch((req: Request, res: Response) => {
    res.send('Update activity by id');
  })
  .delete((req: Request, res: Response) => {
    res.send('Delete activity by id');
  });

export default activitiesRouter;
