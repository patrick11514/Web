/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely } from 'kysely';

export const up = async (conn: Kysely<any>) => {
    await conn.schema.alterTable('equipment_type').renameColumn('name', 'lang_key').execute();
};

export const down = async (conn: Kysely<any>) => {
    await conn.schema.alterTable('equipment_type').renameColumn('lang_key', 'name').execute();
};
