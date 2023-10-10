import express from 'express';

import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  updateRecord,
  getCurrentGoals,
} from './record.controller';

const recordsRouter = express.Router();

recordsRouter.route('/').get(getAllRecords).post(createRecord);

recordsRouter.route('/goals/:dateDayTz').get(getCurrentGoals);
recordsRouter.route('/goals').get(getCurrentGoals);

recordsRouter
  .route('/:recordId')
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default recordsRouter;
