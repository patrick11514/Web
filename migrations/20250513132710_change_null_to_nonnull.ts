/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely } from 'kysely';

export const up = async (conn: Kysely<any>) => {
    await conn.schema
        .alterTable('equipment')
        .modifyColumn('link', 'varchar(512)', (col) => col.notNull())
        .execute();
};

export const down = async (conn: Kysely<any>) => {
    await conn.schema.alterTable('equipment').modifyColumn('link', 'varchar(512)').execute();
};
