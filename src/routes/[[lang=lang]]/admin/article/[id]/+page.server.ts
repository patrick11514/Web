import {
  constructEmptyTranslations,
  gatherTranslationsAll
} from '$/lib/server/functions';
import { Server } from '$/lib/server/server';
import { conn } from '$/lib/server/variables';
import type { Article, Exposure, GalleryImage } from '$/types/database';
import { redirect, type Actions } from '@sveltejs/kit';
import type { Insertable } from 'kysely';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const equipmentData = await conn.selectFrom('equipment').selectAll().execute();

  const baseData = {
    equipment: equipmentData
  };

  if (params.id === 'new')
    return {
      article: {
        title: '',
        description: '',
        content_md: '',
        images: [],
        exposures: [],
        equipment: []
      } as Insertable<Article> & {
        images: Insertable<GalleryImage>[];
        exposures: Insertable<Exposure>[];
        equipment: number[];
      },
      ...baseData,
      dynamicTranslations: constructEmptyTranslations()
    };

  const article = await conn
    .selectFrom('article')
    .selectAll()
    .where('id', '=', params.id)
    .executeTakeFirst();

  if (!article) {
    redirect(302, `/${params.lang ?? 'cs'}/admin/article`);
  }

  const images = await conn
    .selectFrom('gallery_image')
    .selectAll()
    .where('article_id', '=', params.id)
    .orderBy('id', 'asc')
    .execute();

  const exposures = await conn
    .selectFrom('exposure')
    .selectAll()
    .where('article_id', '=', params.id)
    .orderBy('id', 'asc')
    .execute();

  const equipment = await conn
    .selectFrom('article_equipment')
    .select(['equipment_id'])
    .where('article_equipment.article_id', '=', params.id)
    .orderBy('article_equipment.id', 'asc')
    .execute();

  return {
    article: {
      ...article,
      images,
      exposures,
      equipment: equipment.map((e) => e.equipment_id)
    },
    ...baseData,
    dynamicTranslations: await gatherTranslationsAll([
      article.title,
      article.description,
      article.content_md,
      ...images.map((image) => image.alt_text)
    ])
  };
}) satisfies PageServerLoad;

export const actions = {
  create: Server.actions.article.POST,
  edit: Server.actions.article.PUT
} satisfies Actions;
