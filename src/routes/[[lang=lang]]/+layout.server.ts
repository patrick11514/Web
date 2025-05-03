import { languages } from '$/lib/lang/index.svelte';
import { Server } from '$/lib/server/server';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    return {
        api: Server.hydrateToClient(),
        lang: languages[params.lang ?? 'cs'],
        languageList: Object.keys(languages)
    };
}) satisfies LayoutServerLoad;
