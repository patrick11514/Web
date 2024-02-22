import { Server } from '$/lib/server/server';
import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    const data = await conn.selectFrom('project').select('uuid').where('uuid', '=', ev.params.uuid).executeTakeFirst();

    if (!data) {
        throw redirect(302, '/projects');
    }

    return {
        project: await Server.ssr.projects.POST(ev, {
            uuid: ev.params.uuid
        })
    };
}) satisfies PageServerLoad;
