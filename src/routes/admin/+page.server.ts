import { jwt } from '$/lib/server/variables';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const session = cookies.get('session');

    if (session) {
        const data = await jwt.getCookie(session);

        if (data) {
            throw redirect(302, '/admin/main');
        }
    }
}) satisfies PageServerLoad;
