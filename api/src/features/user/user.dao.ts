import { AccounUpdate, NewAccount } from '../../db/types';
import { db } from '../../db/index';

async function findOne(id: bigint) {
  return db.selectFrom('account').selectAll().where('id', '=', id).executeTakeFirst();
}

async function findOneByEmail(email: string) {
  return db.selectFrom('account').selectAll().where('email', '=', email).executeTakeFirst();
}

async function create(account: NewAccount) {
  return db.insertInto('account').values(account).returningAll().executeTakeFirst();
}

async function update(accountEmail: string, accountData: AccounUpdate) {
  return db
    .updateTable('account')
    .set(accountData)
    .where('account.email', '=', accountEmail)
    .returningAll()
    .executeTakeFirst();
}

async function createVerificationCode(accountId: bigint, code: string) {
  return db
    .insertInto('verification_code')
    .columns(['account_id', 'code'])
    .values({ account_id: accountId, code })
    .returningAll()
    .executeTakeFirst();
}

// ________
// public API
export default {
  findOne,
  findOneByEmail,
  create,
  update,
  createVerificationCode,
};
