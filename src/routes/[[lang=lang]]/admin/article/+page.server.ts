import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const previews = await conn
    .selectFrom('gallery_image')
    .innerJoin(
      (eb) =>
        eb
          .selectFrom('gallery_image')
          .select(['article_id', conn.fn.min('id').as('min_id')])
          .groupBy('article_id')
          .as('min'),
      (eb) => eb.onRef('gallery_image.article_id', '=', 'min.article_id').onRef('gallery_image.id', '=', 'min.min_id')
    )
    .select(['gallery_image.article_id', 'gallery_image.name', 'gallery_image.alt_text'])
    .execute();

  const articles = await conn.selectFrom('article').selectAll().orderBy('created_at', 'desc').execute();

  return {
    articles: articles.map((article) => ({
      ...article,
      preview: previews.find((preview) => preview.article_id === article.id)
    }))
  };
}) satisfies PageServerLoad;
