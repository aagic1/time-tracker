import express, { Router, Request, Response } from 'express';
import {
  getAllActivities,
  getActivity,
  createActivity,
  deleteActivity,
} from '../controllers/activities';

const activitiesRouter: Router = express.Router();

activitiesRouter.route('/').get(getAllActivities).post(createActivity);

activitiesRouter
  .route('/:activityId')
  .get(getActivity)
  .patch((req: Request, res: Response) => {
    res.send('Update activity by id');
  })
  .delete(deleteActivity);

export default activitiesRouter;
