import type { UserData, UserState } from '$/types/types';
import type { Cookies } from '@sveltejs/kit';
import { jwt } from './variables';

export const getUserState = (cookies: Cookies): UserState => {
    const session = cookies.get('session');
    if (!session) {
        return {
            logged: false
        };
    }

    const data = jwt.getCookie<UserData>(session);

    if (!data) {
        return {
            logged: false
        };
    }

    return {
        logged: true,
        data
    };
};
