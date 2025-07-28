/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely, sql } from 'kysely';
import { v4 } from 'uuid';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('translations')
    .addColumn('key', 'uuid')
    .addColumn('lang', 'varchar(2)')
    .addColumn('text', 'text', (col) => col.notNull())
    .addPrimaryKeyConstraint('pk_translations', ['key', 'lang'])
    .execute();

  //now we need to migrate posts texts into translations table
  const posts = await conn.selectFrom('article').selectAll().execute();

  //here we move the content_md of each post into translations table
  for (const post of posts) {
    const titleUuid = v4();
    await conn.transaction().execute(async (trx) => {
      await trx
        .insertInto('translations')
        .values({
          key: titleUuid,
          lang: 'cs',
          text: post.title
        })
        .execute();
      await trx
        .updateTable('article')
        .set({
          title: titleUuid
        })
        .where('id', '=', post.id)
        .execute();
    });

    const descriptionUuid = v4();
    await conn.transaction().execute(async (trx) => {
      await trx
        .insertInto('translations')
        .values({
          key: descriptionUuid,
          lang: 'cs',
          text: post.description
        })
        .execute();
      await trx
        .updateTable('article')
        .set({
          description: descriptionUuid
        })
        .where('id', '=', post.id)
        .execute();
    });

    const contentUuid = v4();
    await conn.transaction().execute(async (trx) => {
      await trx
        .insertInto('translations')
        .values({
          key: contentUuid,
          lang: 'cs',
          text: post.content_md
        })
        .execute();
      await trx
        .updateTable('article')
        .set({
          content_md: contentUuid
        })
        .where('id', '=', post.id)
        .execute();
    });
  }

  const images = await conn.selectFrom('gallery_image').selectAll().execute();

  for (const image of images) {
    const uuid = v4();
    await conn.transaction().execute(async (trx) => {
      await trx
        .insertInto('translations')
        .values({
          key: uuid,
          lang: 'cs',
          text: image.alt_text
        })
        .execute();
      await trx
        .updateTable('gallery_image')
        .set({
          alt_text: uuid
        })
        .where('id', '=', image.id)
        .execute();
    });
  }

  await sql`ALTER TABLE article CHANGE title title UUID NOT NULL`.execute(conn);
  await sql`ALTER TABLE article CHANGE description description UUID NOT NULL`.execute(
    conn
  );
  await sql`ALTER TABLE article CHANGE content_md content_md UUID NOT NULL`.execute(conn);
  await sql`ALTER TABLE gallery_image CHANGE alt_text alt_text UUID NOT NULL`.execute(
    conn
  );

  await conn.schema
    .alterTable('article')
    .addForeignKeyConstraint('title_fk', ['title'], 'translations', ['key'])
    .execute();
  await conn.schema
    .alterTable('article')
    .addForeignKeyConstraint('description_fk', ['description'], 'translations', ['key'])
    .execute();
  await conn.schema
    .alterTable('article')
    .addForeignKeyConstraint('content_md_fk', ['content_md'], 'translations', ['key'])
    .execute();
  await conn.schema
    .alterTable('gallery_image')
    .addForeignKeyConstraint('alt_text_fk', ['alt_text'], 'translations', ['key'])
    .execute();
};

export const down = async (conn: Kysely<any>) => {
  // first we need to remove the foreign key constraint
  await sql`ALTER TABLE article DROP FOREIGN KEY title_fk`.execute(conn);
  await sql`ALTER TABLE article DROP FOREIGN KEY description_fk`.execute(conn);
  await sql`ALTER TABLE article DROP FOREIGN KEY content_md_fk`.execute(conn);
  await sql`ALTER TABLE gallery_image DROP FOREIGN KEY alt_text_fk`.execute(conn);
  // then we need to move the content_md back to article table
  const articles = await conn.selectFrom('article').selectAll().execute();
  const translations = await conn
    .selectFrom('translations')
    .selectAll()
    .where('lang', '=', 'cs')
    .execute();

  await sql`ALTER TABLE article CHANGE title title varchar(56) NOT NULL`.execute(conn);
  await sql`ALTER TABLE article CHANGE description description varchar(128) NOT NULL`.execute(
    conn
  );
  await sql`ALTER TABLE article CHANGE content_md content_md text NOT NULL`.execute(conn);
  await sql`ALTER TABLE gallery_image CHANGE alt_text alt_text varchar(256) NOT NULL`.execute(
    conn
  );

  const updateCol = async (
    type: 'title' | 'description' | 'content_md',
    id: string,
    key: string
  ) => {
    const value = translations.find((t) => t.key === key);
    if (value) {
      await conn
        .updateTable('article')
        .set({
          [type]: value.text
        })
        .where('id', '=', id)
        .execute();
    }
  };

  //now update the articles with the content_md
  for (const article of articles) {
    await updateCol('title', article.id, article.title);
    await updateCol('description', article.id, article.description);
    await updateCol('content_md', article.id, article.content_md);
  }

  //now update images
  const images = await conn.selectFrom('gallery_image').selectAll().execute();
  for (const image of images) {
    const value = translations.find((t) => t.key === image.alt_text);
    if (value) {
      await conn
        .updateTable('gallery_image')
        .set({
          alt_text: value.text
        })
        .where('id', '=', image.id)
        .execute();
    }
  }

  // finally we can drop the translations table
  await conn.schema.dropTable('translations').execute();
};
