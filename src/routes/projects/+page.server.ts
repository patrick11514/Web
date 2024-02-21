import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (ev) => {
    return {
        projects: await Server.ssr.projects(ev)
    };
}) satisfies PageServerLoad;
