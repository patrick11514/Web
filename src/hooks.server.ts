import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    const response = await resolve(event);
    const path = event.url.pathname;

    const disallowedPaths = ['/api'];

    if (response.status === 200 && !event.locals.is404 && !disallowedPaths.some((p) => path.startsWith(p))) {
        console.log('log URL', event.url.pathname);
    }

    return response;
}) satisfies Handle;
