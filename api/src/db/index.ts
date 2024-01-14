import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { Pool, types } from 'pg';
import parse from 'postgres-interval';

function parseInterval(interval: string) {
  let parsed = parse(interval);
  return {
    hours: parsed.hours + parsed.days * 24,
    minutes: parsed.minutes,
    seconds: parsed.seconds,
    miliseconds: parsed.milliseconds,
  };
}

types.setTypeParser(types.builtins.INTERVAL, parseInterval);

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
