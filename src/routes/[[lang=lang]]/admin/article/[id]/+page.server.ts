import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    if (params.id === 'new') return;

    const article = await conn.selectFrom('article').selectAll().where('id', '=', params.id).executeTakeFirst();

    if (!article) {
        redirect(302, `/${params.lang ?? 'cs'}/admin/article`);
    }

    const images = await conn.selectFrom('gallery_image').selectAll().where('article_id', '=', params.id).orderBy('id', 'asc').execute();

    const exposures = await conn.selectFrom('exposure').selectAll().where('article_id', '=', params.id).orderBy('id', 'asc').execute();

    const equipment = await conn
        .selectFrom('article_equipment')
        .innerJoin('equipment', 'article_equipment.equipment_id', 'equipment.id')
        .selectAll()
        .where('article_equipment.article_id', '=', params.id)
        .orderBy('article_equipment.id', 'asc')
        .execute();

    return {
        article: {
            ...article,
            images,
            exposures,
            equipment: equipment.map((e) => ({
                id: e.id,
                name: e.name,
                link: e.link,
                type_id: e.type_id
            }))
        }
    };
}) satisfies PageServerLoad;
