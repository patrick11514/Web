import { Server } from '$/lib/server/server';
import { jwt } from '$/lib/server/variables';
import type { LoginData, RegularUser } from '$/types/types';
import type { Any } from '@patrick115/sveltekitapi';

import type { LayoutServerLoad } from './$types';

type LoginDataWithAppData = {
    appData: Any;
    sessionData: LoginData;
};

export const load = (async (event) => {
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
