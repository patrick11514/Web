import type { GalleryItem, Response, ResponseWithData } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import crypto from 'node:crypto';
import fs from 'node:fs';
import Path from 'node:path';
import { z } from 'zod';
import { adminProcedure, procedure } from '../../api';
import { conn } from '../../variables';
import single from './single';

const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.avif', '.tiff', '.webp', '.webm'] as const;

const upload = adminProcedure.POST.input(FormDataInput).query(async ({ input }) => {
    const file = input.get('file') as File | null;
    if (!file) {
        return {
            status: false,
            code: 400,
            message: 'No file provided'
        } satisfies ErrorApiResponse;
    }

    const root = Path.join('projects', 'gallery');

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }

    let path = Path.join(root, file.name);
    const fileName = Path.parse(file.name);

    while (fs.existsSync(path)) {
        path = Path.join(root, fileName.name + crypto.randomBytes(4).toString('hex') + fileName.ext);
    }

    if (!extensions.includes(fileName.ext as (typeof extensions)[number])) {
        return {
            status: false,
            code: 400,
            message: 'Nahrál jsi neplatný typ souboru'
        } satisfies ErrorApiResponse;
    }

    const buffer = await file.arrayBuffer();

    fs.writeFileSync(path, Buffer.from(buffer));

    return {
        status: true,
        data: file.name
    } satisfies ResponseWithData<string>;
});

const list = procedure.GET.query(async () => {
    try {
        const galleryItems = await conn.selectFrom('gallery').selectAll().orderBy('date', 'desc').execute();

        const joinTable = await conn.selectFrom('gallery_equipment').selectAll().execute();

        const equipments = await conn
            .selectFrom('equipment')
            .innerJoin('equipment_type', 'equipment.type', 'equipment_type.id')
            .select(['equipment.id', 'equipment.link', 'equipment.name', 'equipment_type.name as type', 'equipment.id as type_id'])
            .execute();

        const data: GalleryItem[] = [];

        for (const item of galleryItems) {
            const equipmentIds = joinTable.filter((join) => join.gallery_id === item.id).map((item) => item.equipment_id);

            data.push({
                ...item,
                equipment: equipments.filter((equipment) => equipmentIds.includes(equipment.id))
            });
        }

        return {
            status: true,
            data
        } satisfies ResponseWithData<GalleryItem[]>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Internal server error'
        } satisfies ErrorApiResponse;
    }
});

const add = procedure.PUT.input(
    z.object({
        id: z.number().optional(),
        alt: z.string(),
        date: z.date(),
        name: z.string(),
        equipment: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                link: z.string(),
                type: z.string(),
                type_id: z.number()
            })
        )
    })
).query(async ({ input }) => {
    try {
        const result = await conn
            .insertInto('gallery')
            .values({
                name: input.name,
                date: input.date,
                alt: input.alt
            })
            .executeTakeFirst();

        //enter equipment
        if (!result.insertId) {
            throw new Error('Unable to get id');
        }

        await conn
            .insertInto('gallery_equipment')
            .values(
                input.equipment.map((item) => {
                    return {
                        gallery_id: Number(result.insertId),
                        equipment_id: item.id
                    };
                })
            )
            .execute();

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

const remove = adminProcedure.DELETE.input(z.number()).query(async ({ input }) => {
    await conn.deleteFrom('gallery').where('id', '=', input).execute();

    return {
        status: true
    } satisfies Response;
});

const edit = adminProcedure.PATCH.input(
    z.object({
        id: z.number(),
        alt: z.string(),
        date: z.coerce.date(),
        name: z.string(),
        equipment: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                link: z.string(),
                type: z.string(),
                type_id: z.number()
            })
        )
    })
).query(async ({ input }) => {
    try {
        await conn
            .updateTable('gallery')
            .set({
                name: input.name,
                date: input.date,
                alt: input.alt
            })
            .where('id', '=', input.id)
            .execute();

        //delete old equipment
        await conn.deleteFrom('gallery_equipment').where('gallery_id', '=', input.id).execute();

        //add current equipment
        await conn
            .insertInto('gallery_equipment')
            .values(
                input.equipment.map((item) => {
                    return {
                        gallery_id: input.id,
                        equipment_id: item.id
                    };
                })
            )
            .execute();

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

export default [upload, list, add, remove, edit, { single }];
