import { fail } from '@sveltejs/kit';
import { procedure, router } from './api';
import { FormDataInput } from '@patrick115/sveltekitapi';
import { conn, jwt } from './variables';
import type { ErrorPath } from '../lang';
import bcrypt from 'bcrypt';
import { COOKIE_EXPIRE } from '$env/static/private';
import type { ResponseWithData, UserData } from '$/types/types';

export const r = router({
    login: procedure.POST.input(FormDataInput).query(async ({ input, ev: { cookies } }) => {
        const username = input.get('username') as string | null;
        const password = input.get('password') as string | null;

        if (!username || !password) {
            return fail(401, {
                status: false,
                message: 'login.form' satisfies ErrorPath
            });
        }

        const data = await conn.selectFrom('account').selectAll().where('username', '=', username).executeTakeFirst();

        if (!data) {
            return fail(401, {
                status: false,
                message: 'login.username' satisfies ErrorPath
            });
        }

        if (!bcrypt.compareSync(password, data.password)) {
            return fail(401, {
                status: false,
                message: 'login.password' satisfies ErrorPath
            });
        }

        const userData = {
            ...data,
            password: undefined
        };

        const session = jwt.setCookie(userData);

        cookies.set('session', session, {
            path: '/',
            maxAge: parseInt(COOKIE_EXPIRE)
        });

        return {
            status: true,
            data: userData
        } satisfies ResponseWithData<UserData>;
    })
});

export type AppRouter = typeof r;
