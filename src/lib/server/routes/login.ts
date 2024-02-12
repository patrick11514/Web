import type { RegularUser, ResponseWithData } from '$/types/types';
import { COOKIE_EXPIRE } from '$env/static/private';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { procedure } from '../api';
import { conn, jwt } from '../variables';

export const login = procedure.POST.input(
    z.object({
        username: z.string(),
        password: z.string()
    })
).query(async ({ ev: { cookies }, input }) => {
    const userData = await conn.selectFrom('user').selectAll().where('username', '=', input.username).executeTakeFirst();

    if (!userData) {
        return {
            status: false,
            code: 400,
            message: 'Zadal jsi neplatné uživatelské jméno'
        } satisfies ErrorApiResponse;
    }

    const { password: hashedPassword } = userData;

    const result = bcrypt.compareSync(input.password, hashedPassword);

    if (!result) {
        return {
            status: false,
            code: 400,
            message: 'Zadal jsi neplatné heslo'
        } satisfies ErrorApiResponse;
    }

    const data = {
        id: userData.id,
        username: userData.username
    };

    const cookie = await jwt.setCookie(data);

    cookies.set('session', cookie, {
        path: '/',
        maxAge: parseInt(COOKIE_EXPIRE) * 100
    });

    return {
        status: true,
        data
    } satisfies ResponseWithData<RegularUser>;
});
