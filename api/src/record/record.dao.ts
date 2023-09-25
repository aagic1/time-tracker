import { sql, Expression, SqlBool, expressionBuilder } from 'kysely';
import { db } from '../db';
import { DB, NewRecord, RecordUpdate } from '../db/types';
import { QueryParams } from './record.validator';

async function findById(accountId: bigint, recordId: bigint) {
  return db
    .selectFrom('record')
    .innerJoin('activity', 'record.activity_id', 'activity.id')
    .selectAll('record')
    .select([
      'activity.name as activity_name',
      'activity.color',
      'activity.session_goal',
      'activity.day_goal',
    ])
    .where('record.id', '=', recordId)
    .where('activity.account_id', '=', accountId)
    .executeTakeFirst();
}

async function find(accountId: bigint, queryParams?: QueryParams) {
  return db
    .selectFrom('record')
    .selectAll('record')
    .innerJoin('activity', 'activity.id', 'record.activity_id')
    .select([
      'activity.name as activity_name',
      'activity.color as color',
      'activity.session_goal as goal',
    ])
    .where('activity.account_id', '=', accountId)
    .where((eb) => {
      if (!queryParams) {
        return eb.and([]);
      }

      const filters: Expression<SqlBool>[] = [];
      const { active, activityId, comment, date, dateFrom, dateTo } =
        queryParams;

      if (active === true) {
        filters.push(eb('record.stopped_at', 'is', null));
      } else if (active === false) {
        filters.push(eb('record.stopped_at', 'is not', null));
      }

      if (activityId) {
        filters.push(eb('activity.id', '=', activityId));
      }

      if (comment) {
        filters.push(eb('record.comment', 'ilike', `%${comment}%`));
      }

      if (date && !dateFrom && !dateTo) {
        filters.push(filterRecordsBetweenDates(date, date));
      }

      // ugly nesting
      if (dateFrom) {
        if (!dateTo || dateTo >= addDaysToDate(new Date(), 1)) {
          filters.push(filterRecordsBetweenDates(dateFrom, new Date()));
        } else {
          filters.push(filterRecordsBetweenDates(dateFrom, dateTo));
        }
      } else if (dateTo) {
        if (dateTo >= addDaysToDate(new Date(), 1)) {
          filters.push(eb('started_at', '<', addDaysToDate(dateTo, 1)));
        } else {
          filters.push(eb('started_at', '<', dateTo));
        }
      }

      return eb.and(filters);
    })
    .execute();
}

function filterRecordsBetweenDates(startDate: Date, stopDate: Date) {
  const eb = expressionBuilder<DB, 'record'>();

  return eb.or([
    eb.and([
      eb('started_at', '<=', startDate),
      eb.or([
        eb('stopped_at', '>=', startDate),
        eb('stopped_at', 'is', null).and(
          sql`${startDate}`,
          '<',
          addDaysToDate(new Date(), 1)
        ),
      ]),
    ]),
    eb.and([
      eb('started_at', '>=', startDate),
      eb('started_at', '<', addDaysToDate(stopDate, 1)),
      eb.or([
        eb('stopped_at', 'is not', null),
        eb(sql`${startDate}`, '<', addDaysToDate(new Date(), 1)),
      ]),
    ]),
  ]);
}

async function remove(accountId: bigint, recordId: bigint) {
  return db
    .deleteFrom('record')
    .where(({ eb }) =>
      eb.and([
        eb('id', '=', recordId),
        eb(
          'record.activity_id',
          'in',
          eb
            .selectFrom('activity')
            .where('account_id', '=', accountId)
            .select('activity.id')
        ),
      ])
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
          sql`${record.activity_id}`.as('acid'),
          sql`${record.comment}`.as('commt'),
          sql`${record.started_at}`.as('startedat'),
          sql`${record.stopped_at}`.as('stoppedat'),
        ])
        .where((eb) =>
          eb.and([
            eb(
              'activity.id',
              'in',
              eb
                .selectFrom('activity')
                .select('id')
                .where('activity.account_id', '=', accountId)
                .where('activity.id', '=', record.activity_id)
            ),
          ])
        )
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
    .with('updated', (db) =>
      db
        .updateTable('record')
        .set(record)
        .where('id', '=', record_id)
        .where((eb) => {
          const filters: Expression<SqlBool>[] = [];
          if (record.activity_id) {
            filters.push(
              eb.exists(
                eb
                  .selectFrom('activity')
                  .select(eb.lit(1).as('1'))
                  .where('activity.account_id', '=', accountId)
                  .where('activity.id', '=', record.activity_id)
              )
            );
          }

          return eb.and(filters);
        })
        .returningAll()
    )
    .selectFrom('updated')
    .innerJoin('activity', 'updated.activity_id', 'activity.id')
    .selectAll('updated')
    .select([
      'activity.name as activity_name',
      'activity.color',
      'activity.session_goal',
      'activity.day_goal',
    ])
    .executeTakeFirst();
}

export default {
  findById,
  find,
  remove,
  create,
  update,
};

// add validation, should be int, maybe only positive, or also negative?
function addDaysToDate(date: Date, days: number) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + days));
}
