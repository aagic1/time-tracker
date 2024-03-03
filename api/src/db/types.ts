import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import type { IPostgresInterval } from 'postgres-interval';

export type Int8 = ColumnType<bigint, bigint, bigint>;
export type Interval = ColumnType<IPostgresInterval, string, string>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountTable {
  id: Generated<bigint>;
  email: string;
  password: string;
  verified: Generated<boolean>;
}

export interface ActivityTable {
  id: Generated<bigint>;
  account_id: Int8;
  name: string;
  color: string;
  session_goal: Interval | null;
  day_goal: Interval | null;
  week_goal: Interval | null;
  month_goal: Interval | null;
  archived: Generated<boolean>;
}

export interface RecordTable {
  id: Generated<bigint>;
  activity_id: Int8;
  comment: string | null;
  started_at: Timestamp;
  stopped_at: Timestamp | null;
}

export interface VerificationCodeTable {
  id: Generated<number>;
  account_id: Int8;
  code: string;
  created_at: Generated<Timestamp>;
}

export interface DB {
  account: AccountTable;
  activity: ActivityTable;
  record: RecordTable;
  verificationCode: VerificationCodeTable;
}

export type Account = Selectable<AccountTable>;
export type Activity = Selectable<ActivityTable>;
export type Record = Selectable<RecordTable>;

export type NewAccount = Omit<Insertable<AccountTable>, 'id'>;
export type NewActivity = Omit<Insertable<ActivityTable>, 'id'>;
export type NewRecord = Omit<Insertable<RecordTable>, 'id'>;

export type AccounUpdate = Omit<Updateable<AccountTable>, 'id' | 'email' | 'username'>;
export type ActivityUpdate = Omit<Updateable<ActivityTable>, 'id' | 'account_id'>;
export type RecordUpdate = Omit<Updateable<RecordTable>, 'id'>;
