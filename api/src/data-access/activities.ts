import { Activity } from 'kysely-codegen';
import { db } from '../db';

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

// async function

export default {
  findByAccountId,
};
