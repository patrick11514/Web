import czech from './czech';
import english from './english';

export const languages = {
    cs: {
        t: czech,
        flag: '🇨🇿',
        name: 'Čeština'
    },
    en: {
        t: english,
        flag: '🇺🇸',
        name: 'English'
    }
};

export const getPath = (path: string, langs: string[]) => {
    const parts = path.split('/').filter(Boolean);
    if (langs.includes(parts[0])) {
        parts.shift();
    }
    return `/${parts.join('/')}`;
};
