import type { Equipment, EquipmentInfo, Response, ResponseWithData } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { adminProcedure, procedure } from '../../api';
import { conn } from '../../variables';
import t from './type';

const add = adminProcedure.PUT.input(
    z.object({
        name: z.string(),
        link: z.string().url(),
        type: z.number()
    })
).query(async ({ input }) => {
    try {
        await conn.insertInto('equipment').values(input).execute();

        return {
            status: true
        } satisfies Response;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Internal server error'
        } satisfies ErrorApiResponse;
    }
});

const get = procedure.GET.query(async () => {
    const data = await conn
        .selectFrom('equipment')
        .innerJoin('equipment_type', 'equipment.type', 'equipment_type.id')
        .select(['equipment.name', 'equipment_type.name as type', 'equipment.link', 'equipment.id', 'equipment_type.id as type_id'])
        .execute();

    return {
        status: true,
        data
    } satisfies ResponseWithData<EquipmentInfo[]>;
});

const remove = adminProcedure.DELETE.input(z.number()).query(async ({ input }) => {
    await conn.deleteFrom('equipment').where('id', '=', input).execute();

    return {
        status: true
    } satisfies Response;
});

const single = adminProcedure.POST.input(z.number()).query(async ({ input }) => {
    const item = await conn.selectFrom('equipment').selectAll().executeTakeFirst();

    if (!item) {
        return {
            status: false,
            code: 404,
            message: 'Not found'
        } satisfies ErrorApiResponse;
    }

    return {
        status: true,
        data: item
    } satisfies ResponseWithData<Equipment>;
});

const update = adminProcedure.PATCH.input(
    z.object({
        id: z.number().min(1),
        name: z.string(),
        link: z.string().url(),
        type: z.number()
    })
).query(async ({ input }) => {
    const result = await conn.updateTable('equipment').set(input).where('id', '=', input.id).executeTakeFirst();

    if (!result) {
        return {
            status: false,
            code: 404,
            message: 'Not found'
        } satisfies ErrorApiResponse;
    }

    return {
        status: true
    } satisfies Response;
});

export default [
    get,
    add,
    remove,
    single,
    update,
    {
        type: t
    }
];
