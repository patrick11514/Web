import { Server } from '$/lib/server/server';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    return {
        //SELECT COUNT(*), page FROM visitors WHERE DATE(date) = CURDATE() GROUP BY page;

        today: await Server.ssr.stats.getToday(event),
        thisWeek: await Server.ssr.stats.getWeek(event),
        yearData: await Server.ssr.stats.weekGraph.GET(event)
    };
}) satisfies PageServerLoad;
