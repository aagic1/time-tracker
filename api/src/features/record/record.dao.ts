import { sql, Expression, SqlBool, expressionBuilder } from 'kysely';
import { db } from '../../db';
import { DB, NewRecord, RecordUpdate } from '../../db/types';
import { QueryParams } from './record.validator';

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
    filters.push(eb('record.activity_id', '=', activityId));
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

export default {
  findById,
  find,
  remove,
  create,
  update,
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
