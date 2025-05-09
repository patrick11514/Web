import { getUserState } from '$/lib/server/functions';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const userState = getUserState(cookies);

    if (!userState.logged) {
        redirect(302, '/login');
    }
}) satisfies LayoutServerLoad;
