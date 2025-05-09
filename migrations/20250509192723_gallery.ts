/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely, sql } from 'kysely';

export const up = async (conn: Kysely<any>) => {
    await conn.schema
        .createTable('equipment_type')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'varchar(64)', (col) => col.notNull())
        .execute();

    await conn.schema
        .createTable('equipment')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('type_id', 'integer', (col) => col.notNull().references('equipment_type.id'))
        .addColumn('name', 'varchar(128)', (col) => col.notNull())
        .addColumn('link', 'varchar(512)')
        .execute();

    await conn.schema
        .createTable('article')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('title', 'varchar(256)', (col) => col.notNull())
        .addColumn('content_md', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await conn.schema
        .createTable('article_equipment')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('article_id', 'uuid', (col) => col.notNull().references('article.id'))
        .addColumn('equipment_id', 'integer', (col) => col.notNull().references('equipment.id'))
        .execute();

    await conn.schema
        .createTable('gallery_image')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('article_id', 'uuid', (col) => col.notNull().references('article.id'))
        .addColumn('alt_text', 'varchar(256)', (col) => col.notNull())
        .execute();

    await conn.schema
        .createTable('exposure_total')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('article_id', 'uuid', (col) => col.notNull().references('article.id'))
        .addColumn('type', 'varchar(16)', (col) => col.notNull()) // e.g. 'light', 'dark', 'flat'
        .addColumn('count', 'integer', (col) => col.notNull())
        .addColumn('exposure_time_s', 'real', (col) => col.notNull())
        .execute();

    await conn.schema
        .createTable('daily_light_exposure')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('article_id', 'uuid', (col) => col.notNull().references('article.id'))
        .addColumn('date', 'date', (col) => col.notNull())
        .addColumn('count', 'integer', (col) => col.notNull())
        .addColumn('exposure_time_s', 'real', (col) => col.notNull())
        .execute();
};

export const down = async (conn: Kysely<any>) => {
    await conn.schema.dropTable('daily_light_exposure').execute();
    await conn.schema.dropTable('exposure_total').execute();
    await conn.schema.dropTable('gallery_image').execute();
    await conn.schema.dropTable('article_equipment').execute();
    await conn.schema.dropTable('article').execute();
    await conn.schema.dropTable('equipment').execute();
    await conn.schema.dropTable('equipment_type').execute();
};
