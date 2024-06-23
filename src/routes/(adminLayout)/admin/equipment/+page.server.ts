import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        equipment: await Server.ssr.equipment.GET(ev)
    };
}) satisfies PageServerLoad;
