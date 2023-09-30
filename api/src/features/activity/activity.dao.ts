import { db } from '../../db';
import { NewActivity, ActivityUpdate } from '../../db/types';
import { QueryString } from './activity.types';

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

async function findByAccountId(account_id: bigint, filters: QueryString) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('account_id', '=', account_id)
    .where((eb) => eb.and(filters))
    .orderBy('name')
    .execute();
}

async function findByIdAndAccountId(id: bigint, account_id: bigint) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

async function findByNameAndAccountId(name: string, account_id: bigint) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

async function create(activity: NewActivity) {
  return db
    .insertInto('activity')
    .values(activity)
    .returning(columnsToReturn)
    .executeTakeFirst();
}

async function update(
  name: string,
  account_id: bigint,
  activity: ActivityUpdate
) {
  return db
    .updateTable('activity')
    .set(activity)
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .returning(columnsToReturn)
    .executeTakeFirst();
}

function remove(name: string, account_id: bigint) {
  return db
    .deleteFrom('activity')
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

export default {
  findByAccountId,
  findByNameAndAccountId,
  findByIdAndAccountId,
  create,
  update,
  remove,
};
