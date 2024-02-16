import { db } from '../../db';
import { sql } from 'kysely';
import { NewActivity, ActivityUpdate } from '../../db/types';
import { QueryString } from './activity.types';

const columnsToReturn = [
  'id',
  'name',
  sql<string>`concat('#', activity.color)`.as('color'),
  'archived',
  'session_goal as sessionGoal',
  'day_goal as dayGoal',
  'week_goal as weekGoal',
  'month_goal as monthGoal',
] as const;

async function findAll(account_id: bigint, filters: QueryString) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('account_id', '=', account_id)
    .where((eb) => eb.and(filters))
    .orderBy('name')
    .execute();
}

async function findOne(account_id: bigint, id: bigint) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('id', '=', id)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

async function findOneByName(account_id: bigint, name: string) {
  return db
    .selectFrom('activity')
    .select(columnsToReturn)
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

// mozda i ovdje kao parametar poslati userId umjesto da bude unutar activitya
async function create(activity: NewActivity) {
  return db.insertInto('activity').values(activity).returning(columnsToReturn).executeTakeFirst();
}

async function update(account_id: bigint, name: string, activity: ActivityUpdate) {
  return db
    .updateTable('activity')
    .set(activity)
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .returning(columnsToReturn)
    .executeTakeFirst();
}

function remove(account_id: bigint, name: string) {
  return db
    .deleteFrom('activity')
    .where('name', '=', name)
    .where('account_id', '=', account_id)
    .executeTakeFirst();
}

export default {
  findAll,
  findOne,
  findOneByName,
  create,
  update,
  remove,
};
