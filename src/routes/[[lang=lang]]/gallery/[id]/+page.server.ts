import { gatherTranslations, redirect } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
  const parentData = await parent();

  const post = await conn.selectFrom('article').selectAll().where('id', '=', params.id).executeTakeFirst();
  if (!post) {
    return redirect(302, '/gallery');
  }

  const images = await conn.selectFrom('gallery_image').selectAll().where('article_id', '=', post.id).orderBy('id', 'asc').execute();
  const exposures = await conn.selectFrom('exposure').selectAll().where('article_id', '=', post.id).orderBy('date', 'asc').execute();
  const equipment = await conn
    .selectFrom('article_equipment')
    .innerJoin('equipment', 'equipment_id', 'equipment.id')
    .innerJoin('equipment_type', 'type_id', 'equipment_type.id')
    .selectAll()
    .where('article_id', '=', post.id)
    .execute();

  return {
    post: {
      ...post,
      images,
      exposures,
      equipment
    },
    dynamicTranslations: await gatherTranslations([post.title, post.description, post.content_md, ...images.map((image) => image.alt_text)], parentData.selectedLang)
  };
}) satisfies PageServerLoad;
