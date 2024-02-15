import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const id = params.id;

    const data = await conn.selectFrom('tag').select('id').where('id', '=', parseInt(id)).executeTakeFirst();
    if (!data) {
        throw redirect(302, '/admin/tags');
    }
}) satisfies PageServerLoad;
