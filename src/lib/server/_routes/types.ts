import { loggedProcedure } from '../api';
import { conn } from '../variables';
import type { ActionsResponse, Response } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import { fail } from '@sveltejs/kit';
import type { ErrorPath } from '$/lib/lang';
import { z } from 'zod';

export default [
    loggedProcedure.POST.input(FormDataInput).query(async ({ input }) => {
        const lang_key = input.get('lang_key') as string | null;

        if (!lang_key) {
            return fail(401, {
                status: false,
                message: 'equipment.form' satisfies ErrorPath
            } satisfies ActionsResponse);
        }
        try {
            await conn
                .insertInto('equipment_type')
                .values({
                    lang_key
                })
                .execute();

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
        const lang_key = input.get('lang_key') as string | null;

        if (!id || isNaN(Number(id))) {
            return fail(401, {
                status: false,
                message: 'internal' satisfies ErrorPath
            } satisfies ActionsResponse);
        }

        if (!lang_key || lang_key.trim().length === 0) {
            return fail(401, {
                status: false,
                message: 'equipment.empty' satisfies ErrorPath
            } satisfies ActionsResponse);
        }

        try {
            await conn
                .updateTable('equipment_type')
                .set({
                    lang_key
                })
                .where('id', '=', Number(id))
                .execute();

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
        const id = input;

        if (isNaN(Number(id))) {
            return {
                status: false,
                code: 400,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        try {
            await conn.deleteFrom('equipment_type').where('id', '=', Number(id)).execute();

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
