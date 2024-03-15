import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        items: await Server.ssr.gallery.GET(ev)
    };
}) satisfies PageServerLoad;
