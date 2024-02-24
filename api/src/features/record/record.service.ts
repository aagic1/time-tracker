import { objectToSnake } from 'ts-case-convert';

import recordDAO from './record.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { DateWithTimezone } from './record.helpers';
import { RecordCreate, RecordUpdate, StatisticsQuery, QueryParams } from './record.validator';
import { ActivityRecord, Statistics } from './record.types';

async function getRecord(userId: bigint, recordId: bigint) {
  const record = await recordDAO.findOne(userId, recordId);
  if (!record) {
    throw new NotFoundError(`Record with id=${recordId} not found`);
  }
  return record;
}

async function getAllRecords(userId: bigint, filters: QueryParams) {
  const records = await recordDAO.findAll(userId, filters);
  return records;
}

async function createRecord(userId: bigint, recordData: RecordCreate) {
  const newRecord = await recordDAO.create(userId, objectToSnake(recordData));
  if (!newRecord) {
    throw new NotFoundError(
      `Failed to create record for specified activity. Activity with id=${recordData.activityId} not found.`
    );
  }
  return newRecord;
}

async function updateRecord(userId: bigint, recordId: bigint, recordData: RecordUpdate) {
  const updatedRecord = await recordDAO.update(userId, recordId, objectToSnake(recordData));
  if (!updatedRecord) {
    // this should be more specific.
    // does the recordId or activityId cause the error. Find appropriate solution
    let message = `Failed to update record. Record with recordId=${recordId}`;
    if (recordData.activityId) {
      message += ` or activityId=${recordData.activityId}`;
    }
    message += ' not found';
    throw new NotFoundError(message);
  }
  return updatedRecord;
}

async function deleteRecord(userId: bigint, recordId: bigint) {
  const result = await recordDAO.remove(userId, recordId);
  if (result.numDeletedRows === 0n) {
    throw new NotFoundError(`Failed to delete record. Record with id=${recordId} not found.`);
  }
  return true;
}

async function getStatistics(accountId: bigint, filters: StatisticsQuery) {
  const { from, to, activityId } = filters;

  const records = await recordDAO.findAll(accountId, {
    activityId,
    dateFrom: from,
    dateTo: to,
  });

  const activityStats = new Map<string, Statistics>();
  records.forEach((record) => {
    let elapsedTime = calculateElapsedTime(record, from, to);
    let activityId = record.activityId.toString();
    if (!activityStats.get(activityId)) {
      activityStats.set(activityId, { totalTime: 0, hasActive: false, records: [] });
    }

    const stats = activityStats.get(activityId)!;
    stats.totalTime += elapsedTime;
    stats.hasActive = stats.hasActive || record.stoppedAt != null;
    stats.records.push(record);
  });

  return activityStats;
}

async function getCurrentGoals(accountId: bigint, timezoneOffset: number) {
  const dateNowTZ = new DateWithTimezone(timezoneOffset);

  const dayGoals = recordDAO.getCurrentGoalsByType(accountId, dateNowTZ, 'day');
  const weekGoals = recordDAO.getCurrentGoalsByType(
    accountId,
    dateNowTZ,
    'week'
  );
  const monthGoals = recordDAO.getCurrentGoalsByType(
    accountId,
    dateNowTZ,
    'month'
  );
  try {
    const allGoals = await Promise.all([dayGoals, weekGoals, monthGoals]);
    return { goals: allGoals.flat(), measuredAt: dateNowTZ.toDate() };
  } catch (e) {
    return null;
  }
}

function calculateElapsedTime(
  record: ActivityRecord,
  dateFrom: Date | undefined,
  dateTo: Date | undefined
) {
  let currentDateTime = new Date();

  let lowerBound: Date;
  let upperBound: Date;

  // this code is bad, make it easier to understand
  if (!dateFrom) {
    lowerBound = record.startedAt;
  } else if (record.startedAt < dateFrom) {
    lowerBound = dateFrom;
  } else {
    lowerBound = record.startedAt;
  }

  if (!record.stoppedAt) {
    if (!dateTo || dateTo > currentDateTime) {
      upperBound = currentDateTime;
    } else {
      upperBound = dateTo;
    }
  } else {
    if (!dateTo) {
      upperBound = record.stoppedAt;
    } else {
      upperBound = dateTo;
    }
  }

  return upperBound.getTime() - lowerBound.getTime();
}

// _________
// Public API

export default {
  getRecord,
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getStatistics,
  getCurrentGoals,
};
