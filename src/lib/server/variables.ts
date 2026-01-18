import type { DB } from '$/types/database';
import { env } from '$env/dynamic/private';
import {
  DATABASE_IP,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  JWT_SECRET
} from '$env/static/private';
import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { JWTCookies } from './cookies/main';

export const NINA_BASE_URL = env.NINA_BASE_URL;
export const UPDATE_THRESHOLD_COUNT = env.UPDATE_THRESHOLD_COUNT;

export const jwt = new JWTCookies(JWT_SECRET);
const dialect = new MysqlDialect({
  pool: createPool({
    host: DATABASE_IP,
    port: parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
  })
});

export const conn = new Kysely<DB>({
  dialect
});
