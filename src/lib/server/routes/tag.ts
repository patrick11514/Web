import type { Response, ResponseWithData, Tag } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { adminProcedure, procedure } from '../api';
import { conn } from '../variables';

export const list = procedure.GET.query(async () => {
    try {
        const result = await conn.selectFrom('tag').selectAll().execute();

        return {
            status: true,
            data: result
        } satisfies ResponseWithData<Tag[]>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se načíst tagy'
        } satisfies ErrorApiResponse;
    }
});

const create = procedure.PUT.input(
    z.object({
        text: z.string(),
        color: z.string()
    })
).query(async ({ input }) => {
    const result = await conn
        .insertInto('tag')
        .values({
            name: input.text,
            color: input.color
        })
        .executeTakeFirst();

    if (result.numInsertedOrUpdatedRows == 0n) {
        return {
            status: false,
            code: 500,
            message: 'Nepovedlo se vytvořit tag'
        } satisfies ErrorApiResponse;
    }

    return {
        status: true
    } satisfies Response;
});

const load = adminProcedure.POST.input(
    z.object({
        id: z.number()
    })
).query(async ({ input: { id } }) => {
    const result = await conn.selectFrom('tag').selectAll().where('id', '=', id).executeTakeFirst();

    if (!result) {
        return {
            status: false,
            code: 404,
            message: 'Tag nebyl nalezen'
        } satisfies ErrorApiResponse;
    }

    return {
        status: true,
        data: result
    } satisfies ResponseWithData<Tag>;
});

const update = adminProcedure.PATCH.input(
    z.object({
        id: z.number(),
        text: z.string(),
        color: z.string()
    })
).query(async ({ input }) => {
    try {
        await conn
            .updateTable('tag')
            .set({
                name: input.text,
                color: input.color
            })
            .where('id', '=', input.id)
            .execute();

        return {
            status: true
        } satisfies Response;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepovedlo se upravit tag'
        } satisfies ErrorApiResponse;
    }
});

const remove = adminProcedure.DELETE.input(
    z.object({
        id: z.number()
    })
).query(async ({ input: { id } }) => {
    try {
        await conn.deleteFrom('tag').where('id', '=', id).execute();

        return {
            status: true
        } satisfies Response;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepovedlo se smazat tag'
        } satisfies ErrorApiResponse;
    }
});

export const tag = [list, create, load, update, remove];
