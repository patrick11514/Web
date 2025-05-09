import { Server } from '$/lib/server/server';
import type { Actions } from '@sveltejs/kit';

export const actions = {
    default: Server.actions.login
} satisfies Actions;
