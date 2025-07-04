import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  locals.is404 = true;
}) satisfies PageServerLoad;
