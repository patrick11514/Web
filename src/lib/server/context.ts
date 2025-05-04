import type { AsyncReturnType, CreateContext } from '@patrick115/sveltekitapi';

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const context = (async (ev /*<- SvelteKit's RequestEvent */) => {
    return {}; // Here you can put your context
}) satisfies CreateContext;

export type Context = AsyncReturnType<typeof context>;
