/*eslint-disable @typescript-eslint/no-explicit-any*/

import { Kysely, sql } from 'kysely';
import { v4 } from 'uuid';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('translations')
    .addColumn('key', 'uuid', (col) => col.primaryKey())
    .addColumn('lang', 'varchar(2)', (col) => col.notNull())
    .addColumn('text', 'text', (col) => col.notNull())
    .addUniqueConstraint('translations_lang_key', ['lang', 'key'])
    .execute();

  //now we need to migrate posts texts into translations table
  const posts = await conn.selectFrom('article').selectAll().execute();

  //here we move the content_md of each post into translations table
  for (const post of posts) {
    const uuid = v4();
    await conn
      .insertInto('translations')
      .values({
        key: uuid,
        lang: 'cs',
        text: post.content_md
      })
      .execute();
    await conn
      .updateTable('article')
      .set({
        content_md: uuid
      })
      .where('id', '=', post.id)
      .execute();
  }

  await conn.schema
    .alterTable('article')
    .alterColumn('content_md', (col) => col.setDataType('uuid'))
    .execute();
  await conn.schema.alterTable('article').addForeignKeyConstraint('content_md_fk', ['content_md'], 'translations', ['key']).execute();
};

export const down = async (conn: Kysely<any>) => {
  // first we need to remove the foreign key constraint
  sql`ALTER TABLE "article" DROP CONSTRAINT "content_md_fk"`.execute(conn);
  // then we need to move the content_md back to article table
  const articles = await conn.selectFrom('article').selectAll().execute();
  const translations = await conn
    .selectFrom('translations')
    .selectAll()
    .where('lang', '=', 'cs')
    .where(
      'key',
      'in',
      articles.map((article) => article.content_md)
    )
    .execute();

  //now update the articles with the content_md
  for (const article of articles) {
    const translation = translations.find((t) => t.key === article.content_md);
    if (translation) {
      await conn
        .updateTable('article')
        .set({
          content_md: translation.text
        })
        .where('id', '=', article.id)
        .execute();
    }
  }

  // finally we can drop the translations table
  await conn.schema.dropTable('translations').execute();
};
