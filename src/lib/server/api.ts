import { APICreate, MiddleWareError } from '@patrick115/sveltekitapi';
import type { Context } from './context';

export const t = new APICreate<Context>();

export const router = t.router;
export const procedure = t.procedure;
export const adminProcedure = procedure.use(async ({ next, ctx }) => {
    if (!ctx.logged) {
        throw new MiddleWareError({
            status: false,
            code: 401,
            message: 'You need to sign in.'
        });
    }

    return next({
        logged: true,
        data: ctx.data
    });
});
