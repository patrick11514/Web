/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely } from 'kysely';
import bcrypt from 'bcrypt';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('account')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('username', 'varchar(64)', (col) => col.notNull())
    .addColumn('password', 'varchar(60)', (col) => col.notNull())
    .execute();

  await conn
    .insertInto('account')
    .values({
      username: process.env.DEFAULT_USERNAME!,
      password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD!, parseInt(process.env.HASH_ROUNDS!))
    })
    .execute();
};

export const down = async (conn: Kysely<any>) => {
  await conn.schema.dropTable('account').execute();
};
