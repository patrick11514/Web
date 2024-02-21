import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        projects: await Server.ssr.project.list(ev)
    };
}) satisfies PageServerLoad;
