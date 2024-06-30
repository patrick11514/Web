import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        types: await Server.ssr.equipment.type(ev),
        equipment: await Server.ssr.equipment.POST(ev, parseInt(ev.params.id))
    };
}) satisfies PageServerLoad;
