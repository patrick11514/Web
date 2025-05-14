import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import { loggedProcedure } from '../api';
import { fail } from '@sveltejs/kit';
import type { ActionsResponse, Response } from '$/types/types';
import type { ErrorPath } from '$/lib/lang';
import { conn } from '../variables';
import { z } from 'zod';

export default [
    loggedProcedure.POST.input(FormDataInput).query(async ({ input }) => {
        const name = input.get('name') as string | null;
        const type = input.get('type') as string | null;
        const link = input.get('link') as string | null;

        if (!name || !type || !link || isNaN(Number(type))) {
            return fail(400, {
                status: false,
                message: 'equipment.form' satisfies ErrorPath
            } satisfies ActionsResponse);
        }

        try {
            const equipmentType = await conn.selectFrom('equipment_type').select('id').where('id', '=', Number(type)).executeTakeFirst();
            if (!equipmentType) {
                return fail(400, {
                    status: false,
                    message: 'equipment.form' satisfies ErrorPath
                } satisfies ActionsResponse);
            }

            await conn
                .insertInto('equipment')
                .values({
                    name,
                    type_id: Number(type),
                    link
                })
                .executeTakeFirst();

            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);
            return fail(500, {
                status: false,
                message: 'internal' satisfies ErrorPath
            } satisfies ActionsResponse);
        }
    }),
    loggedProcedure.PATCH.input(FormDataInput).query(async ({ input }) => {
        const id = input.get('id') as string | null;
        const name = input.get('name') as string | null;
        const type = input.get('type') as string | null;
        const link = input.get('link') as string | null;

        if (!id || isNaN(Number(id))) {
            return fail(401, {
                status: false,
                message: 'internal' satisfies ErrorPath
            } satisfies ActionsResponse);
        }

        if (!name || !type || !link || isNaN(Number(type))) {
            return fail(401, {
                status: false,
                message: 'equipment.form' satisfies ErrorPath
            } satisfies ActionsResponse);
        }

        try {
            const equipmentType = await conn.selectFrom('equipment_type').select('id').where('id', '=', Number(type)).executeTakeFirst();
            if (!equipmentType) {
                return fail(400, {
                    status: false,
                    message: 'equipment.form' satisfies ErrorPath
                } satisfies ActionsResponse);
            }

            await conn
                .updateTable('equipment')
                .set({
                    name,
                    type_id: Number(type),
                    link
                })
                .where('id', '=', Number(id))
                .executeTakeFirst();

            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);
            return fail(500, {
                status: false,
                message: 'internal' satisfies ErrorPath
            } satisfies ActionsResponse);
        }
    }),
    loggedProcedure.DELETE.input(z.number()).query(async ({ input }) => {
        if (!input || isNaN(Number(input))) {
            return {
                status: false,
                code: 400,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        try {
            await conn.deleteFrom('equipment').where('id', '=', Number(input)).executeTakeFirst();

            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);
            return {
                status: false,
                code: 500,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }
    })
];
