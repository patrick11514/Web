import type { AsyncReturnType, CreateContext } from '@patrick115/sveltekitapi';
import { getUserState } from './functions';

export const context = (async ({ cookies }) => {
    return getUserState(cookies);
}) satisfies CreateContext;

export type Context = AsyncReturnType<typeof context>;
