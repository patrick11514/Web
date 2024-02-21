import { Server } from '$/lib/server/server';
import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    const id = ev.params.id;

    const data = await conn.selectFrom('tag').select('id').where('id', '=', parseInt(id)).executeTakeFirst();
    if (!data) {
        throw redirect(302, '/admin/tags');
    }

    return {
        tag: await Server.ssr.tag.POST(ev, {
            id: parseInt(id)
        })
    };
}) satisfies PageServerLoad;
