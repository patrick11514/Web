import type { UserData, UserState } from '$/types/types';
import type { Cookies } from '@sveltejs/kit';
import { jwt } from './variables';
import { redirect as _redirect } from '@sveltejs/kit';
import { getState } from '../state.svelte';

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

type Params = Parameters<typeof _redirect>;

export const redirect = (status: Params[0], location: Params[1]) => {
    const state = getState();
    _redirect(status, `/${state.selectedLang || 'cs'}${location}`);
};
