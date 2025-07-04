import { Server } from '$/lib/server/server';
import { type Actions, redirect as _redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserState, redirect } from '$/lib/server/functions';

export const load = (async ({ cookies, url }) => {
  const userState = getUserState(cookies);
  if (userState.logged) {
    if (url.searchParams.get('next')) {
      _redirect(302, url.searchParams.get('next')!);
    } else {
      redirect(302, '/admin');
    }
  }
}) satisfies PageServerLoad;

export const actions = {
  default: Server.actions.login
} satisfies Actions;
