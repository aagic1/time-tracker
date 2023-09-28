import { AccounUpdate, NewAccount } from '../db/types';
import { db } from '../db/index';

async function findByEmail(email: string) {
  return db
    .selectFrom('account')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
}

async function create(account: NewAccount) {
  return db
    .insertInto('account')
    .values({ ...account })
    .returningAll()
    .executeTakeFirst();
}

async function update(accountEmail: string, account: AccounUpdate) {
  return db
    .updateTable('account')
    .set(account)
    .where('account.email', '=', accountEmail)
    .returningAll()
    .executeTakeFirst();
}

export default {
  findByEmail,
  create,
  update,
};
