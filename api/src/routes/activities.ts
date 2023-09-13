import express, { Router, Request, Response } from 'express';
import {
  getAllActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activities';

const activitiesRouter: Router = express.Router();

activitiesRouter.route('/').get(getAllActivities).post(createActivity);

activitiesRouter
  .route('/:activityId')
  .get(getActivity)
  .patch(updateActivity)
  .delete(deleteActivity);

export default activitiesRouter;
