import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { IPostgresInterval } from 'postgres-interval';

export type Int8 = ColumnType<bigint, bigint | string, bigint | string>;
export type Interval = ColumnType<IPostgresInterval, string, string>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountTable {
  id: Generated<bigint>;
  email: string;
  username: string;
  password: string;
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
  active: Generated<boolean>;
}

export interface DB {
  account: AccountTable;
  activity: ActivityTable;
  record: RecordTable;
}

export type Account = Selectable<AccountTable>;
export type Activity = Selectable<ActivityTable>;
export type Record = Selectable<RecordTable>;

export type NewAccount = Omit<Insertable<AccountTable>, 'id'>;
export type NewActivity = Omit<Insertable<ActivityTable>, 'id'>;
export type NewRecord = Omit<Insertable<RecordTable>, 'id'>;

export type AccounUpdate = Omit<Updateable<AccountTable>, 'id'>;
export type ActivityUpdate = Omit<
  Updateable<ActivityTable>,
  'id' | 'account_id'
>;
export type RecordUpdate = Omit<Updateable<RecordTable>, 'id'>;
