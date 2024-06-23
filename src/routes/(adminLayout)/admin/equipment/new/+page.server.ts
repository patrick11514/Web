import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        types: await Server.ssr.equipment.type(ev)
    }
}) satisfies PageServerLoad;
