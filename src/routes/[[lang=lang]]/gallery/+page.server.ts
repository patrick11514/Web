import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const posts = await conn.selectFrom('article').selectAll().orderBy('created_at', 'desc').execute();

    const postsEquipment = await conn
        .selectFrom('article_equipment')
        .innerJoin('equipment', 'article_equipment.equipment_id', 'equipment.id')
        .innerJoin('equipment_type', 'equipment.type_id', 'equipment_type.id')
        .selectAll(['equipment_type', 'equipment'])
        .select('article_id')
        .execute();

    const images = await conn.selectFrom('gallery_image').selectAll().execute();
    const exposures = await conn.selectFrom('exposure').selectAll().execute();

    return {
        posts: posts.map((post) => ({
            ...post,
            equipment: postsEquipment.filter((eq) => eq.article_id === post.id).sort((a, b) => b.priority - a.priority),
            images: images.filter((image) => image.article_id === post.id),
            exposures: exposures.filter((exposure) => exposure.article_id === post.id)
        }))
    };
}) satisfies PageServerLoad;
