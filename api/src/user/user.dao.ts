import { NewAccount } from '../db/types';
import { db } from '../db/index';

function findByEmail(email: string) {
  return db
    .selectFrom('account')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirstOrThrow();
}

function create(account: NewAccount) {
  return db
    .insertInto('account')
    .values({ ...account })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export default {
  findByEmail,
  create,
};
