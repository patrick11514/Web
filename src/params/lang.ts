import { languages } from '$/lib/lang/index.svelte';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is keyof typeof languages => {
    return Object.keys(languages).includes(param);
}) satisfies ParamMatcher;
