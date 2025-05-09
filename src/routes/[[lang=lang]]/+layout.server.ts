import { languages } from '$/lib/lang';
import { Server } from '$/lib/server/server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, url }) => {
    if (!params.lang) {
        let path = url.pathname;
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        redirect(302, `/cs${path}`);
    }

    const lang = params.lang as keyof typeof languages;
    return {
        api: Server.hydrateToClient(),
        lang: languages[lang].t,
        selectedLang: lang,
        languageList: Object.fromEntries(Object.entries(languages).map(([code, lang]) => [code, { name: lang.name, flag: lang.flag }]))
    };
}) satisfies LayoutServerLoad;
