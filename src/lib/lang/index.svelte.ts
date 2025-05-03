import { getContext, setContext } from 'svelte';
import template from './_template';
import czech from './czech';
import english from './english';
import type { z } from 'zod';

type Language = z.infer<typeof template>;

export const getPath = () => {
    return getContext<string>('path');
};

export const getLanguage = () => {
    return getContext<Language>('language');
};

export const setPath = (path: string, languages: string[]) => {
    const parts = path.split('/').filter(Boolean);
    if (languages.includes(parts[0])) {
        parts.shift();
    }

    setContext('path', `/${parts.join('/')}`);
};

export const setLanguage = (lang: Language) => {
    setContext('language', lang);
};

export const languages = {
    cs: czech,
    en: english
};
