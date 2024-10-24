import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        equipment: await Server.ssr.equipment.GET(ev),
        details: await Server.ssr.details.GET(ev)
    };
}) satisfies PageServerLoad;
