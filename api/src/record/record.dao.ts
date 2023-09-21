import { db } from '../db';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

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

async function update() {
  return 'update record';
}

export default {
  findById,
  find,
  remove,
  create,
  update,
};
