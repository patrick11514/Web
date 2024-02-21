import { Server } from '$/lib/server/server';
import { conn } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    const uuid = ev.params.uuid;

    const data = await conn.selectFrom('project').select('uuid').where('uuid', '=', uuid).executeTakeFirst();

    if (!data) {
        throw redirect(302, '/admin/projects');
    }

    return {
        project: await Server.ssr.project.get.POST(ev, { uuid })
    };
}) satisfies PageServerLoad;
