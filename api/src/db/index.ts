import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { Pool, types } from 'pg';

const timestampOID = 1114;
types.setTypeParser(timestampOID, (stringValue) => new Date(stringValue + 'Z'));

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
