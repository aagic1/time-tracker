import { sql } from 'kysely';
import { db } from '../db';
import { IPostgresInterval } from 'postgres-interval';

async function findById() {
  return 'find record by id';
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

async function remove() {
  return 'delete record';
}

async function create() {
  return 'create record';
}

type RecordEnriched = {
  id: bigint;
  comment: string | null;
  active: boolean;
  started_at: Date;
  stopped_at: Date | null;
  color: string;
  activity_name: string;
  goal: IPostgresInterval | null;
};

type UpdateFields = {
  activity_id?: bigint;
  comment?: string;
  started_at?: Date;
  stopped_at?: Date;
  active?: boolean;
};

async function update(record_id: bigint, updateFields: UpdateFields) {
  return db
    .with('updated', (db) =>
      db
        .updateTable('record')
        .set(updateFields)
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