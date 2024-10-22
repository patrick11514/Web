import { Server } from '$/lib/server/server';
import { conn, jwt } from '$/lib/server/variables';
import type { LoginData, RegularUser } from '$/types/types';
import type { Any } from '@patrick115/sveltekitapi';

import type { LayoutServerLoad } from './$types';

type LoginDataWithAppData = {
    appData: Any;
    sessionData: LoginData;
};

export const load = (async (event) => {
    //if page is not error ie. route is valid, then log visitors
    if (event.route !== null) {
        //stats
        const ip = event.getClientAddress();
        const page = event.url.pathname;

        conn.insertInto('visitors')
            .values({
                ip,
                page,
                date: new Date()
            })
            .execute();
    }

    //other things
    const cookie = event.cookies.get('session');

    const appData = Server.hydrateToClient();

    if (!cookie) {
        return {
            sessionData: {
                logged: false
            },
            appData
        } satisfies LoginDataWithAppData;
    }

    const data = jwt.getCookie<RegularUser>(cookie);

    if (!data) {
        return {
            sessionData: {
                logged: false
            },
            appData
        } satisfies LoginDataWithAppData;
    }

    return {
        sessionData: {
            logged: true,
            data
        },
        appData
    } satisfies LoginDataWithAppData;
}) satisfies LayoutServerLoad;
