import type { Handle } from '@sveltejs/kit';
import { conn } from './lib/server/variables';

export const handle = (async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;

  const disallowedPaths = ['/api'];
  const UA = event.request.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|slurp/i.test(UA);

  if (
    !isBot &&
    response.status === 200 &&
    !event.locals.is404 &&
    !disallowedPaths.some((p) => path.startsWith(p))
  ) {
    conn
      .insertInto('visitors')
      .values({
        ip: event.getClientAddress(),
        page: path,
        user_agent: event.request.headers.get('user-agent') || ''
      })
      .execute()
      .catch((err) => {
        //eslint-disable-next-line no-console
        console.error('Error logging visitor:', err);
      });
  }

  return response;
}) satisfies Handle;
