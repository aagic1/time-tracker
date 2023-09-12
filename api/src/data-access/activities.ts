import { db } from '../db';
import { NewActivity } from '../db/types';

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

async function findById(activityId: number, accountId: number) {
  return db
    .selectFrom('activity')
    .selectAll()
    .where('id', '=', activityId)
    .where('account_id', '=', accountId)
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

function remove(activityId: number, accountId: number) {
  return db
    .deleteFrom('activity')
    .where('id', '=', activityId)
    .where('account_id', '=', accountId)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export default {
  findById,
  findByAccountId,
  create,
  remove,
};
