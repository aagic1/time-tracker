import express from 'express';

import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecord,
  updateRecord,
  getCurrentGoals,
  getStatistics,
} from './record.controller';

const recordsRouter = express.Router();

recordsRouter.route('/').get(getAllRecords).post(createRecord);

recordsRouter.route('/goals/:dateDayTz').get(getCurrentGoals);
recordsRouter.route('/goals').get(getCurrentGoals);

// maybe /goals/current?timezoneOffset=...
// or /goals/active?timezoneOffset=...

// recordsRouter.route('/goals/:activityName/:goalType');

// maybe /goals/:activityName/details/:gaolType
// maybe /goals/:activityName/history/:gaolType
// maybe /goals/:activityName/statistics/:gaolType
// npr /api/v1/records/goals/ucenje/weekGoals?from=date&to=date
// npr /api/v1/records/goals/ucenje/dayGoals?from=date&to=date
// npr /api/v1/records/goals/trening/monthGoals?from=date&to=date
// maybe make this 3 separate routes instead of path parameter?

recordsRouter.route('/statistics').get(getStatistics);
// general statistics for activities
// npr /api/v1/records/statistics?from=date&to=date&activityId=bigint&activityId=bigint&by=activity ili category ili tag
// // npr /api/v1/records/statistics?tpye=date,week,7days,lastmonth(maybe),month,year,range&from=date&to=date&activityId=bigint&activityId=bigint&by=activity ili category ili tag
// // date, week, month, year require timezoneOffset
// // 7days don't need anything for getting the correct date range
// // range requires to and from, or either one of them, or maybe explicitly requires both. we will see

// detailed statistics for specific activity
// recordsRouter.route('/statistics/details/:activityId?from=date&to=date&activityId=bigint&by=activity ili category ili tag');
// recordsRouter.route('/statistics/:activityName/details');
// recordsRouter.route('/statistics/:activityId');

// later when we add categories and tags
// recordsRouter.route('/statistics/:type')
// recordsRouter.route('/statistics/:type/')

recordsRouter
  .route('/:recordId')
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default recordsRouter;
