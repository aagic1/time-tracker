import express, { Router, Request, Response } from 'express';
import {
  getAllActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from './activity.controller';

const activitiesRouter: Router = express.Router();

activitiesRouter.route('/').get(getAllActivities).post(createActivity);

activitiesRouter
  .route('/:activityName')
  .get(getActivity)
  .patch(updateActivity)
  .delete(deleteActivity);

export default activitiesRouter;
