import express from 'express';

import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  updateRecord,
} from './record.controller';

const recordsRouter = express.Router();

recordsRouter.route('/').get(getAllRecords).post(createRecord);

recordsRouter
  .route('/:recordId')
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default recordsRouter;
