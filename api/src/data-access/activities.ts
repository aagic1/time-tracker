import { db } from '../db';
import { NewActivity, ActivityUpdate } from '../db/types';

async function findByAccountId(account_id: number) {
  return db
    .selectFrom('activity')
    .select([
      'id',
      'account_id',
      'name',
      'color',
      'archived',
      'session_goal',
      'day_goal',
      'week_goal',
      'month_goal',
    ])
    .where('account_id', '=', account_id)
    .orderBy('name')
    .execute();
}

async function findByIdAndAccountId(id: number, account_id: number) {
  return db
    .selectFrom('activity')
    .selectAll()
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .execute();
}

async function create(activity: NewActivity) {
  console.log('db', activity);
  return db
    .insertInto('activity')
    .values(activity)
    .returning([
      'id',
      'account_id as accountId',
      'name',
      'color',
      'archived',
      'session_goal as sessionGoal',
      'day_goal as dayGoal',
      'week_goal as weekGoal',
      'month_goal as monthGoal',
    ])
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
    .returningAll()
    .executeTakeFirstOrThrow();
}

function remove(id: number, account_id: number) {
  return db
    .deleteFrom('activity')
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export default {
  findByIdAndAccountId,
  findByAccountId,
  create,
  update,
  remove,
};
