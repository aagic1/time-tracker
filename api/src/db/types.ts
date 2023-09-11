import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { IPostgresInterval } from 'postgres-interval';

export type Interval = ColumnType<IPostgresInterval, string, string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountTable {
  id: Generated<number>;
  email: string;
  username: string;
  password: string;
}

export interface ActivityTable {
  id: Generated<number>;
  account_id: number;
  name: string;
  color: string;
  session_goal: Interval | null;
  day_goal: Interval | null;
  week_goal: Interval | null;
  month_goal: Interval | null;
  archived: Generated<boolean>;
}

export interface RecordTable {
  id: Generated<number>;
  activity_id: number;
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

export type NewAccount = Insertable<AccountTable>;
export type NewActivity = Insertable<ActivityTable>;
export type NewRecord = Insertable<RecordTable>;

export type AccounUpdate = Updateable<AccountTable>;
export type ActivityUpdate = Updateable<ActivityTable>;
export type RecordUpdate = Updateable<RecordTable>;
