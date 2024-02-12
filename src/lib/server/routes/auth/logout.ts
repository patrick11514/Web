import type { Response } from '$/types/types';
import { adminProcedure } from '../../api';

export const logout = adminProcedure.GET.query(async ({ ev: { cookies } }) => {
    cookies.delete('session', {
        path: '/'
    });

    return {
        status: true
    } satisfies Response;
});
