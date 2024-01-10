import {
  sql,
  Expression,
  SqlBool,
  expressionBuilder,
  QueryCreator,
} from 'kysely';
import { db } from '../../db';
import { DB, NewRecord, RecordUpdate } from '../../db/types';
import { QueryParams } from './record.validator';
import type { IPostgresInterval } from 'postgres-interval';
import {
  getEndOfDayDate,
  getEndOfMonth,
  getEndOfWeek,
  getStartOfDayDate,
  getStartOfMonth,
  getStartOfWeek,
} from './record.utils';
import { DateObject } from './record.types';

const recordColumnsToSelect = [
  'record.id as recordId',
  'record.comment as comment',
  'record.started_at as startedAt',
  'record.stopped_at as stoppedAt',
  'record.activity_id as activityId',
  'activity.name as activityName',
  'activity.color as color',
  'activity.day_goal as dayGoal',
  'activity.session_goal as sessionGoal',
] as const;

async function findById(accountId: bigint, recordId: bigint) {
  return db
    .selectFrom('record')
    .innerJoin('activity', 'record.activity_id', 'activity.id')
    .select(recordColumnsToSelect)
    .where('activity.account_id', '=', accountId)
    .where('record.id', '=', recordId)
    .executeTakeFirst();
}

async function find(accountId: bigint, queryParams?: QueryParams) {
  return db
    .selectFrom('record')
    .innerJoin('activity', 'activity.id', 'record.activity_id')
    .select(recordColumnsToSelect)
    .where('activity.account_id', '=', accountId)
    .where(getFilters(queryParams))
    .execute();
}

function getFilters(queryParams: QueryParams | undefined) {
  const eb = expressionBuilder<DB, 'record'>();

  if (!queryParams) {
    return eb.and([]);
  }

  const filters: Expression<SqlBool>[] = [];
  const { active, activityId, comment, dateFrom, dateTo } = queryParams;

  if (active === true) {
    filters.push(eb('record.stopped_at', 'is', null));
  } else if (active === false) {
    filters.push(eb('record.stopped_at', 'is not', null));
  }

  if (activityId) {
    filters.push(eb('record.activity_id', 'in', activityId));
  }

  if (comment) {
    filters.push(eb('record.comment', 'ilike', `%${comment}%`));
  }

  // maybe: if dateFrom > dateTo throw some error to signalize invalid data
  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw 'Invalid data. This should not happen, because zod validates request query params. Can still happen if developer manually enters this functions parameters';
  }

  if (dateFrom && dateTo && dateFrom < dateTo) {
    filters.push(filterRecordsBetweenDates(dateFrom, dateTo));
  } else if (dateFrom && !dateTo) {
    filters.push(filterRecordsFrom(dateFrom));
  } else if (!dateFrom && dateTo) {
    filters.push(filterRecordsTo(dateTo));
  }

  return eb.and(filters);
}

async function remove(accountId: bigint, recordId: bigint) {
  return db
    .deleteFrom('record')
    .where('record.id', '=', recordId)
    .where(({ eb }) =>
      eb(
        'record.activity_id',
        'in',
        eb
          .selectFrom('activity')
          .where('account_id', '=', accountId)
          .select('activity.id')
      )
    )
    .executeTakeFirst();
}

async function create(accountId: bigint, record: NewRecord) {
  return db
    .insertInto('record')
    .columns(['activity_id', 'comment', 'started_at', 'stopped_at'])
    .expression(
      db
        .selectFrom('activity')
        .select([
          sql.val(record.activity_id).as('activityId'),
          sql.val(record.comment).as('comment'),
          sql.val(record.started_at).as('startedAt'),
          sql.val(record.stopped_at).as('stoppedAt'),
        ])
        .where(belongsActivityToAccount(accountId, record.activity_id))
        .limit(1)
    )
    .returningAll()
    .executeTakeFirst();
}

async function update(
  accountId: bigint,
  record_id: bigint,
  record: RecordUpdate
) {
  return db
    .with('updateResult', (db) =>
      db
        .updateTable('record')
        .set(record)
        .where('id', '=', record_id)
        .where(({ eb, selectFrom }) =>
          eb(
            'record.activity_id',
            'in',
            selectFrom('activity')
              .select('id')
              .where('account_id', '=', accountId)
          )
        )
        .where((eb) => {
          if (!record.activity_id) {
            return eb.and([]);
          }
          return belongsActivityToAccount(accountId, record.activity_id);
        })
        .returningAll()
    )
    .selectFrom('updateResult as record')
    .innerJoin('activity', 'record.activity_id', 'activity.id')
    .select(recordColumnsToSelect)
    .executeTakeFirst();
}

function getTimestampForTimezone(date: Date, timezoneOffset: number) {
  const timestampOffset = new Date(date);
  timestampOffset.setMinutes(
    date.getMinutes() + (date.getTimezoneOffset() - timezoneOffset)
  );
  return timestampOffset;
}

async function findCurrentGoals(accountId: bigint, timezoneOffset: number) {
  const dateNow = new Date();
  const offsetDateNow = getTimestampForTimezone(dateNow, timezoneOffset);
  const offsetDateObject = {
    year: offsetDateNow.getFullYear(),
    month: offsetDateNow.getMonth() + 1,
    dayOfMonth: offsetDateNow.getDate(),
    dayOfWeek: offsetDateNow.getDay(),
    timezoneOffset,
  };

  const startOfDay = getStartOfDayDate(offsetDateObject);
  const endOfDay = getEndOfDayDate(offsetDateObject);

  const startOfWeek = getStartOfWeek(offsetDateObject);
  const endOfWeek = getEndOfWeek(offsetDateObject);

  const startOfMonth = getStartOfMonth(offsetDateObject);
  const endOfMonth = getEndOfMonth(offsetDateObject);

  return db
    .with('currentDayGoalData', (db) =>
      db
        .selectFrom('activity as a')
        .leftJoin('record as r', 'r.activity_id', 'a.id')
        .select((eb) => [
          'a.id',
          'a.name',
          'a.color',
          eb.val('dayGoal').as('goalName'),
          'a.day_goal as goalTime',
          sql<boolean>`(COUNT(r.started_at) - COUNT(r.stopped_at)) > 0`.as(
            'hasActiveRecord'
          ),
          sql<IPostgresInterval | null>`SUM(
            CASE
              WHEN r.stopped_at IS NOT NULL THEN
                CASE
                  WHEN r.started_at >= ${startOfDay} AND r.stopped_at <= ${endOfDay} THEN r.stopped_at - r.started_at
                  WHEN r.started_at <= ${startOfDay} AND r.stopped_at >= ${startOfDay} AND r.stopped_at <= ${endOfDay} THEN r.stopped_at - ${startOfDay}
                  WHEN r.started_at <= ${startOfDay} AND r.stopped_at >= ${endOfDay} THEN ${endOfDay} - ${startOfDay}::timestamp
                  WHEN r.started_at >= ${startOfDay} AND r.started_at <= ${endOfDay} AND r.stopped_at >= ${endOfDay} THEN ${endOfDay} - r.started_at
                END 
              ELSE
                CASE
                  WHEN r.started_at >= ${startOfDay} AND r.started_at <= ${endOfDay} THEN ${dateNow.toISOString()} - r.started_at
                  WHEN r.started_at < ${startOfDay} THEN ${dateNow.toISOString()} - ${startOfDay}::timestamp
                END 
            END
        )`.as('totalTime'),
        ])
        .where('account_id', '=', accountId)
        .where('day_goal', 'is not', null)
        .where('archived', '=', false)
        .where((eb) =>
          eb.or([
            eb.and([
              eb('r.started_at', '>=', startOfDay),
              eb('r.started_at', '<=', endOfDay),
            ]),
            eb('r.started_at', '<=', startOfDay).and(
              eb.or([
                eb('r.stopped_at', '>=', startOfDay),
                eb('r.stopped_at', 'is', null),
              ])
            ),
            eb('r.started_at', 'is', null),
          ])
        )
        .groupBy(['a.name', 'a.id'])
    )
    .with('currentWeekGoalData', (db) =>
      db
        .selectFrom('activity as a')
        .leftJoin('record as r', 'r.activity_id', 'a.id')
        .select((eb) => [
          'a.id',
          'a.name',
          'a.color',
          eb.val('weekGoal').as('goalName'),
          'a.week_goal as goalTime',
          sql<boolean>`(COUNT(r.started_at) - COUNT(r.stopped_at)) > 0`.as(
            'hasActiveRecord'
          ),
          sql<IPostgresInterval | null>`SUM(
            CASE
              WHEN r.stopped_at IS NOT NULL THEN
                CASE
                  WHEN r.started_at >= ${startOfWeek} AND r.stopped_at <= ${endOfWeek} THEN r.stopped_at - r.started_at
                  WHEN r.started_at <= ${startOfWeek} AND r.stopped_at >= ${startOfWeek} AND r.stopped_at <= ${endOfWeek} THEN r.stopped_at - ${startOfWeek}
                  WHEN r.started_at <= ${startOfWeek} AND r.stopped_at >= ${endOfWeek} THEN ${endOfWeek} - ${startOfWeek}::timestamp
                  WHEN r.started_at >= ${startOfWeek} AND r.started_at <= ${endOfWeek} AND r.stopped_at >= ${endOfWeek} THEN ${endOfWeek} - r.started_at
                END
              ELSE
                CASE
                  WHEN r.started_at >= ${startOfWeek} AND r.started_at <= ${endOfWeek} THEN ${dateNow.toISOString()} - r.started_at
                  WHEN r.started_at < ${startOfWeek} THEN ${dateNow.toISOString()} - ${startOfWeek}::timestamp
                END
            END
          )`.as('totalTime'),
        ])
        .where('account_id', '=', accountId)
        .where('week_goal', 'is not', null)
        .where('archived', '=', false)
        .where((eb) =>
          eb.or([
            eb.and([
              eb('r.started_at', '>=', startOfWeek),
              eb('r.started_at', '<=', endOfWeek),
            ]),
            eb('r.started_at', '<=', startOfWeek).and(
              eb.or([
                eb('r.stopped_at', '>=', startOfWeek),
                eb('r.stopped_at', 'is', null),
              ])
            ),
            eb('r.started_at', 'is', null),
          ])
        )
        .groupBy(['a.name', 'a.id'])
    )
    .with('currentMonthGoalData', (db) =>
      db
        .selectFrom('activity as a')
        .leftJoin('record as r', 'r.activity_id', 'a.id')
        .select((eb) => [
          'a.id',
          'a.name',
          'a.color',
          eb.val('monthGoal').as('goalName'),
          'a.month_goal as goalTime',
          sql<boolean>`(COUNT(r.started_at) - COUNT(r.stopped_at)) > 0`.as(
            'hasActiveRecord'
          ),
          sql<IPostgresInterval | null>`SUM(
            CASE
              WHEN r.stopped_at IS NOT NULL THEN
                CASE
                  WHEN r.started_at >= ${startOfMonth} AND r.stopped_at <= ${endOfMonth} THEN r.stopped_at - r.started_at
                  WHEN r.started_at <= ${startOfMonth} AND r.stopped_at >= ${startOfMonth} AND r.stopped_at <= ${endOfMonth} THEN r.stopped_at - ${startOfMonth}
                  WHEN r.started_at <= ${startOfMonth} AND r.stopped_at >= ${endOfMonth} THEN ${endOfMonth} - ${startOfMonth}::timestamp
                  WHEN r.started_at >= ${startOfMonth} AND r.started_at <= ${endOfMonth} AND r.stopped_at >= ${endOfMonth} THEN ${endOfMonth} - r.started_at
                END
              ELSE
                CASE
                  WHEN r.started_at >= ${startOfMonth} AND r.started_at <= ${endOfMonth} THEN ${dateNow.toISOString()} - r.started_at
                  WHEN r.started_at < ${startOfMonth} THEN ${dateNow.toISOString()} - ${startOfMonth}::timestamp
                  
                END
            END
          )`.as('totalTime'),
        ])
        .where('a.account_id', '=', accountId)
        .where('a.month_goal', 'is not', null)
        .where('a.archived', '=', false)
        .where((eb) =>
          eb.or([
            eb.and([
              eb('r.started_at', '>=', startOfMonth),
              eb('r.started_at', '<=', endOfMonth),
            ]),
            eb('r.started_at', '<=', startOfMonth).and(
              eb.or([
                eb('r.stopped_at', '>=', startOfMonth),
                eb('r.stopped_at', 'is', null),
              ])
            ),
            eb('r.started_at', 'is', null),
          ])
        )
        .groupBy(['a.name', 'a.id'])
    )
    .selectFrom('currentDayGoalData')
    .union((eb) => eb.selectFrom('currentWeekGoalData').selectAll())
    .union((eb) => eb.selectFrom('currentMonthGoalData').selectAll())
    .selectAll()
    .orderBy(['goalName', 'name'])
    .execute();
}

export default {
  findById,
  find,
  remove,
  create,
  update,
  findCurrentGoals,
};

function filterRecordsBetweenDates(startDate: Date, stopDate: Date) {
  const eb = expressionBuilder<DB, 'record'>();
  const dateNow = new Date();

  return eb.or([
    eb.and([
      eb('started_at', '<=', startDate),
      eb.or([
        eb('stopped_at', '>=', startDate),
        eb('stopped_at', 'is', null).and(sql.val(startDate), '<', dateNow),
      ]),
    ]),
    eb.and([
      eb('started_at', '>=', startDate),
      eb('started_at', '<=', stopDate),
      eb.or([
        eb('stopped_at', 'is not', null),
        eb('stopped_at', 'is', null).and(sql.val(startDate), '<', dateNow),
      ]),
    ]),
  ]);
}

function filterRecordsFrom(dateFrom: Date): Expression<SqlBool> {
  const eb = expressionBuilder<DB, 'record'>();
  return eb.or([
    eb('stopped_at', '>=', dateFrom),
    eb('stopped_at', 'is', null).and(sql.val(dateFrom), '<=', new Date()),
  ]);
}

function filterRecordsTo(dateTo: Date): Expression<SqlBool> {
  const eb = expressionBuilder<DB, 'record'>();
  return eb('started_at', '<=', dateTo);
}

function belongsActivityToAccount(accountId: bigint, activityId: bigint) {
  const eb = expressionBuilder<DB, 'activity'>();
  return eb.exists((eb) =>
    eb
      .selectFrom('activity')
      .where('account_id', '=', accountId)
      .where('id', '=', activityId)
  );
}
