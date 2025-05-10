import { FormDataInput } from '@patrick115/sveltekitapi';
import { procedure } from '../api';
import type { ErrorPath } from '$/lib/lang';
import type { ActionsResponse, Response } from '$/types/types';
import { fail } from '@sveltejs/kit';
import { conn, jwt } from '../variables';
import bcrypt from 'bcrypt';
import { COOKIE_EXPIRE } from '$env/static/private';

export default procedure.POST.input(FormDataInput).query(async ({ input, ev: { cookies } }) => {
    const username = input.get('username') as string | null;
    const password = input.get('password') as string | null;

    if (!username || !password) {
        return fail(401, {
            status: false,
            message: 'login.form' satisfies ErrorPath
        } satisfies ActionsResponse);
    }

    const data = await conn.selectFrom('account').selectAll().where('username', '=', username).executeTakeFirst();

    if (!data) {
        return fail(401, {
            status: false,
            message: 'login.username' satisfies ErrorPath
        } satisfies ActionsResponse);
    }

    if (!bcrypt.compareSync(password, data.password)) {
        return fail(401, {
            status: false,
            message: 'login.password' satisfies ErrorPath
        } satisfies ActionsResponse);
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
        status: true
    } satisfies Response;
});
