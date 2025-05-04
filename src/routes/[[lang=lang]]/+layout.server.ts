import { languages } from '$/lib/lang';
import { Server } from '$/lib/server/server';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    const lang = (params.lang ?? 'cs') as keyof typeof languages;

    return {
        api: Server.hydrateToClient(),
        lang: languages[lang].t,
        selectedLang: lang,
        languageList: Object.fromEntries(Object.entries(languages).map(([code, lang]) => [code, { name: lang.name, flag: lang.flag }]))
    };
}) satisfies LayoutServerLoad;
