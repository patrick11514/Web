import { conn } from '$/lib/server/variables';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Server } from '$/lib/server/server';

export const load = (async () => {
    return {
        types: await conn.selectFrom('equipment_type').selectAll().execute(),
        equipment: await conn.selectFrom('equipment').selectAll().execute()
    };
}) satisfies PageServerLoad;

export const actions = {
    typeAdd: Server.actions.types.POST,
    typeEdit: Server.actions.types.PATCH
} satisfies Actions;
