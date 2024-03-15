import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        images: await Server.ssr.gallery.GET(ev)
    };
}) satisfies PageServerLoad;
