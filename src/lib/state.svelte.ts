import type { z } from 'zod';
import template from './lang/_template';

type Language = z.infer<typeof template>;

type State = {
    lang: Language;
    selectedLang: string;
    languages: Record<
        string,
        {
            name: string;
            flag: string;
        }
    >;
    path: string;
};

const state = $state({}) as State;

export const setState = (newState: Partial<State>) => {
    Object.assign(state, newState);
};

export const getState = () => {
    return state as State;
};
