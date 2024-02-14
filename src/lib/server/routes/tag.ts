import { procedure } from '../api';

export const list = procedure.GET.query(async () => {
    console.log(':)');
});

export const tag = [list];
