import { Server } from '$/lib/server/server';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserState } from '$/lib/server/functions';

export const load = (async ({ cookies }) => {
    const userState = getUserState(cookies);
    if (userState.logged) {
        redirect(302, '/admin');
    }
}) satisfies PageServerLoad;

export const actions = {
    default: Server.actions.login
} satisfies Actions;
