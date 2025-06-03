import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Insertable } from 'kysely';
import type { Article, Exposure, GalleryImage } from '$/types/database';

export const load = (async ({ params }) => {
    const equipmentData = await conn.selectFrom('equipment').selectAll().execute();

    const baseData = {
        equipment: equipmentData
    };

    if (params.id === 'new')
        return {
            article: {
                title: '',
                content_md: '',
                images: [],
                exposures: [],
                equipment: []
            } as Insertable<Article> & {
                images: Insertable<GalleryImage>[];
                exposures: Insertable<Exposure>[];
                equipment: number[];
            },
            ...baseData
        };

    const article = await conn.selectFrom('article').selectAll().where('id', '=', params.id).executeTakeFirst();

    if (!article) {
        redirect(302, `/${params.lang ?? 'cs'}/admin/article`);
    }

    const images = await conn.selectFrom('gallery_image').selectAll().where('article_id', '=', params.id).orderBy('id', 'asc').execute();

    const exposures = await conn.selectFrom('exposure').selectAll().where('article_id', '=', params.id).orderBy('id', 'asc').execute();

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
        ...baseData
    };
}) satisfies PageServerLoad;
