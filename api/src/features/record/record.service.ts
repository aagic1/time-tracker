import recordDAO from './record.dao';
import { StatisticsQuery } from './record.validator';

async function getStatistics(accountId: bigint, filters: StatisticsQuery) {
  const { from, to, activityId } = filters;
  let dateFrom: Date | undefined;
  let dateTo: Date | undefined;

  const result = await recordDAO.find(accountId, {
    activityId,
    dateFrom: from,
    dateTo: to,
  });
  const activityStats = new Map<string, number>();
  result.forEach((record) => {
    let elapsedTime = calculateElapsedTime(record, dateFrom, dateTo);
    let activityId = '' + record.activityId;
    if (!activityStats.get(activityId)) {
      activityStats.set(activityId, 0);
    }
    activityStats.set(activityId, activityStats.get(activityId)! + elapsedTime);
  });
  return activityStats;
}

function calculateElapsedTime(
  record: any,
  dateFrom: Date | undefined,
  dateTo: Date | undefined
) {
  let currentDateTime = new Date();

  let lowerBound: Date;
  let upperBound: Date;

  if (!dateFrom) {
    lowerBound = record.startedAt;
  } else if (record.startedAt < dateFrom) {
    lowerBound = dateFrom;
  } else {
    lowerBound = record.startedAt;
  }

  if (!dateTo) {
    if (!record.stoppedAt || record.stoppedAt > currentDateTime) {
      upperBound = currentDateTime;
    } else {
      upperBound = record.stoppedAt;
    }
  } else if (!record.stoppedAt || record.stoppedAt > dateTo) {
    upperBound = dateTo;
  } else {
    upperBound = record.stoppedAt;
  }

  return upperBound.getTime() - lowerBound.getTime();
}

export default {
  getStatistics,
};
