import { getUserState, redirect } from '$/lib/server/functions';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
    const userState = getUserState(cookies);

    if (!userState.logged) {
        redirect(302, `/login?next=${url.pathname}`);
    }
}) satisfies LayoutServerLoad;
