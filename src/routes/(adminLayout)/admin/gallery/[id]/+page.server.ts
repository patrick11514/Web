import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        equipment: await Server.ssr.equipment.GET(ev),
        data: await Server.ssr.gallery.single(ev, parseInt(ev.params.id))
    };
}) satisfies PageServerLoad;
