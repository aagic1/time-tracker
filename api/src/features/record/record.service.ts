import { objectToSnake } from 'ts-case-convert';

import recordDAO from './record.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { DateWithTimezone } from './record.helpers';
import { RecordCreate, RecordUpdate, StatisticsQuery, QueryParams } from './record.validator';
import { Statistics } from './record.types';
import { calculateElapsedTime } from './record.utils';

// __________
// Public API

async function getRecord(userId: bigint, recordId: bigint) {
  const record = await recordDAO.findOne(userId, recordId);
  if (!record) {
    throw new NotFoundError(`Record with id=${recordId} not found`);
  }
  return record;
}

async function getAllRecords(userId: bigint, filters: QueryParams, timezoneOffset: number) {
  const records = await recordDAO.findAll(
    userId,
    new DateWithTimezone(timezoneOffset).toDate(),
    filters
  );
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

async function getStatistics(accountId: bigint, filters: StatisticsQuery, timezoneOffset: number) {
  const { from, to, activityId } = filters;
  const currentDate = new DateWithTimezone(timezoneOffset).toDate();

  const records = await recordDAO.findAll(accountId, currentDate, {
    activityId,
    dateFrom: from,
    dateTo: to,
  });

  const activityStats = new Map<string, Statistics>();
  records.forEach((record) => {
    let elapsedTime = calculateElapsedTime(record, from, to, currentDate);
    let activityId = record.activityId.toString();
    if (!activityStats.get(activityId)) {
      activityStats.set(activityId, {
        totalTime: 0,
        hasActive: false,
        activityId: record.activityId,
        activityName: record.activityName,
        color: '#' + record.color,
      });
    }

    const stats = activityStats.get(activityId)!;
    stats.totalTime += elapsedTime;
    stats.hasActive = stats.hasActive || record.stoppedAt == null;
  });

  return { measuredAt: currentDate.toISOString(), stats: Array.from(activityStats.values()) };
}

async function getCurrentGoals(accountId: bigint, timezoneOffset: number) {
  const dateNowTZ = new DateWithTimezone(timezoneOffset);

  const dayGoals = recordDAO.findCurrentGoalsByType(accountId, dateNowTZ, 'day');
  const weekGoals = recordDAO.findCurrentGoalsByType(accountId, dateNowTZ, 'week');
  const monthGoals = recordDAO.findCurrentGoalsByType(accountId, dateNowTZ, 'month');
  try {
    const allGoals = await Promise.all([dayGoals, weekGoals, monthGoals]);
    return { goals: allGoals.flat(), measuredAt: dateNowTZ.toDate() };
  } catch (e) {
    return null;
  }
}

// _________
// Public API export

export default {
  getRecord,
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getStatistics,
  getCurrentGoals,
};
