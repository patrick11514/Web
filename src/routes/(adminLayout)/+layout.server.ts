import { jwt } from '$/lib/server/variables';
import { npm_package_version } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const session = cookies.get('session');

    if (!session) {
        throw redirect(302, '/admin');
    }

    const data = await jwt.getCookie(session);

    if (!data) {
        throw redirect(302, '/admin');
    }

    return {
        version: npm_package_version
    };
}) satisfies LayoutServerLoad;
