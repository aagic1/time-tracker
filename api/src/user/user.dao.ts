import { Account, AccounUpdate, NewAccount } from '../db/types';
import { db } from '../db/index';

function findByEmail(email: string) {
  return db
    .selectFrom('account')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirstOrThrow();
}

function create() {
  return 'create user';
}

export default {
  findByEmail,
  create,
};
