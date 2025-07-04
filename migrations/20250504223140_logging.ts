/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely, sql } from 'kysely';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('visitors')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('ip', 'varchar(255)', (col) => col.notNull())
    .addColumn('user_agent', 'varchar(255)', (col) => col.notNull())
    .addColumn('date', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('page', 'varchar(255)', (col) => col.notNull())
    .execute();
};

export const down = async (conn: Kysely<any>) => {
  await conn.schema.dropTable('visitors').execute();
};
