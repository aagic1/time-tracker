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

async function findByAccountId(account_id: number) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('account_id', '=', account_id)
    .orderBy('name')
    .execute();
}

async function findByIdAndAccountId(id: number, account_id: number) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .execute();
}

async function create(activity: NewActivity) {
  return db
    .insertInto('activity')
    .values(activity)
    .returning(columnsToReturn)
    .executeTakeFirstOrThrow();
}

async function update(
  id: number,
  account_id: number,
  activity: Omit<ActivityUpdate, 'id' | 'account_id'>
) {
  return db
    .updateTable('activity')
    .set(activity)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .returning(columnsToReturn)
    .executeTakeFirstOrThrow();
}

function remove(id: number, account_id: number) {
  return db
    .deleteFrom('activity')
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .returning(columnsToReturn)
    .executeTakeFirstOrThrow();
}

export default {
  findByIdAndAccountId,
  findByAccountId,
  create,
  update,
  remove,
};
