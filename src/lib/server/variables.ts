import type { DB } from '$/types/database';
import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { JWTCookies } from './cookies/main';
import { env } from './env';

export const NINA_BASE_URL = env.NINA_BASE_URL;
export const UPDATE_THRESHOLD_COUNT = env.UPDATE_THRESHOLD_COUNT;

export const jwt = new JWTCookies(env.JWT_SECRET);
const dialect = new MysqlDialect({
  pool: createPool({
    host: env.DATABASE_IP,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME
  })
});

export const conn = new Kysely<DB>({
  dialect
});
