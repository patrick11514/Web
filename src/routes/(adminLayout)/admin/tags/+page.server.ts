import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        tags: await Server.ssr.tag.GET(ev)
    };
}) satisfies PageServerLoad;
