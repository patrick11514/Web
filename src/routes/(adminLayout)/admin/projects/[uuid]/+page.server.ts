import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const uuid = params.uuid;

    const data = await conn.selectFrom('project').select('uuid').where('uuid', '=', uuid).executeTakeFirst();

    if (!data) {
        throw redirect(302, '/admin/projects');
    }
}) satisfies PageServerLoad;
