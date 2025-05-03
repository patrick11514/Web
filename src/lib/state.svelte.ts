import type { z } from 'zod';
import template from './lang/_template';

type Language = z.infer<typeof template>;

type State = {
    lang: Language;
    path: string;
};

const state = $state({}) as State;

export const setState = (newState: State) => {
    const keys = Object.keys(newState) as (keyof State)[];
    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state[key] = newState[key];
    }
};

export const getState = () => {
    return state as State;
};
