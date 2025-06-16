import { languages } from '$/lib/lang';
import { Server } from '$/lib/server/server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getUserState } from '$/lib/server/functions';
import { setState } from '$/lib/state.svelte';

export const load = (async ({ params, url, cookies }) => {
    if (!params.lang) {
        let path = url.pathname;
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        const queryParams = url.searchParams.toString();
        if (queryParams) {
            path += `?${queryParams}`;
        }

        redirect(302, `/cs${path}`);
    }

    setState({
        selectedLang: params.lang as keyof typeof languages,
    })

    const lang = params.lang as keyof typeof languages;
    return {
        api: Server.hydrateToClient(),
        lang: languages[lang].t,
        selectedLang: lang,
        languageList: Object.fromEntries(Object.entries(languages).map(([code, lang]) => [code, { name: lang.name, flag: lang.flag }])),
        userState: getUserState(cookies)
    };
}) satisfies LayoutServerLoad;
