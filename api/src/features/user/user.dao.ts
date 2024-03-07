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
    .executeTakeFirst();
}

async function updateVerificationCode(accountId: bigint, newCode: string) {
  return db
    .updateTable('verification_code')
    .set({ created_at: new Date(), code: newCode })
    .where('account_id', '=', accountId)
    .executeTakeFirst();
}

async function findUserAndVerificationCode(email: string) {
  return db
    .selectFrom('account')
    .leftJoin('verification_code', 'account.id', 'verification_code.account_id')
    .select([
      'verified',
      'account.id as accountId',
      'email',
      'code as verificationCode',
      'created_at as codeCreatedAt',
    ])
    .where('email', '=', email)
    .executeTakeFirst();
}

async function deleteVerificationCode(accountId: bigint) {
  return db.deleteFrom('verification_code').where('account_id', '=', accountId).executeTakeFirst();
}

async function findUserAndRecoveryCode(email: string) {
  return db
    .selectFrom('account')
    .leftJoin('password_recovery_code', 'account.id', 'password_recovery_code.account_id')
    .select([
      'account.id as accountId',
      'email',
      'code as recoveryCode',
      'password_recovery_code.created_at as codeCreatedAt',
    ])
    .where('email', '=', email)
    .executeTakeFirst();
}

async function createOrUpdateRecoveryCode(id: bigint, recoveryCode: string) {
  return db
    .insertInto('password_recovery_code')
    .values({ account_id: id, code: recoveryCode })
    .onConflict((oc) =>
      oc.column('account_id').doUpdateSet({ code: recoveryCode, created_at: new Date() })
    )
    .executeTakeFirst();
}

async function deleteRecoveryCode(accountId: bigint) {
  return db
    .deleteFrom('password_recovery_code')
    .where('account_id', '=', accountId)
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
  findUserAndVerificationCode,
  updateVerificationCode,
  deleteVerificationCode,
  findUserAndRecoveryCode,
  createOrUpdateRecoveryCode,
  deleteRecoveryCode,
};
