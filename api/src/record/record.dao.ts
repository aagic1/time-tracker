import { sql } from 'kysely';
import { db } from '../db';
import { NewRecord, RecordUpdate } from '../db/types';

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

async function find(accountId: bigint) {
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
    .execute();
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
    .columns(['activity_id', 'active', 'comment', 'started_at', 'stopped_at'])
    .expression(
      db
        .selectFrom('activity')
        .select([
          sql`${record.activity_id}`.as('acid'),
          sql`${record.active}`.as('act'),
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

async function update(record_id: bigint, record: RecordUpdate) {
  return db
    .with('updated', (db) =>
      db
        .updateTable('record')
        .set(record)
        .where('id', '=', record_id)
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
  // const result = await sql<RecordEnriched>`
  //   WITH updated AS (
  //     UPDATE record SET activity_id = ${activity_id}
  //     WHERE record.id = ${record_id}
  //     RETURNING *
  //   )
  //   SELECT
  //     updated.id,
  //     updated.comment,
  //     updated.active,
  //     updated.started_at,
  //     updated.stopped_at,
  //     activity.color,
  //     activity.name as activity_name,
  //     activity.session_goal as goal
  //   FROM updated
  //   INNER JOIN activity ON updated.activity_id = activity.id
  //   WHERE updated.id = ${record_id}

  // `.execute(db);
  // return result.rows[0];
}

export default {
  findById,
  find,
  remove,
  create,
  update,
};
