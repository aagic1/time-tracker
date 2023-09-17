import { db } from '../db';
import { NewActivity, ActivityUpdate } from '../db/types';

const columnsToReturn = [
  'id',
  'name',
  'color',
  'archived',
  'session_goal as sessionGoal',
  'day_goal as dayGoal',
  'week_goal as weekGoal',
  'month_goal as monthGoal',
] as const;

async function findByAccountId(account_id: bigint) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('account_id', '=', account_id)
    .orderBy('name')
    .execute();
}

async function findByIdAndAccountId(id: bigint, account_id: bigint) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .executeTakeFirstOrThrow();
}

async function create(activity: NewActivity) {
  return db
    .insertInto('activity')
    .values(activity)
    .returning(columnsToReturn)
    .executeTakeFirstOrThrow();
}

async function update(
  id: bigint,
  account_id: bigint,
  activity: ActivityUpdate
) {
  return db
    .updateTable('activity')
    .set(activity)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .returning(columnsToReturn)
    .executeTakeFirstOrThrow();
}

function remove(id: bigint, account_id: bigint) {
  return db
    .deleteFrom('activity')
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .executeTakeFirstOrThrow();
}

export default {
  findByIdAndAccountId,
  findByAccountId,
  create,
  update,
  remove,
};
