import type { Handle } from '@sveltejs/kit';
import { conn } from './lib/server/variables';

export const handle = (async ({ event, resolve }) => {
    const response = await resolve(event);
    const path = event.url.pathname;

    const disallowedPaths = ['/api'];

    if (response.status === 200 && !event.locals.is404 && !disallowedPaths.some((p) => path.startsWith(p))) {
        conn.insertInto('visitors')
            .values({
                ip: event.getClientAddress(),
                page: path,
                user_agent: event.request.headers.get('user-agent') || ''
            })
            .execute();
    }

    return response;
}) satisfies Handle;
