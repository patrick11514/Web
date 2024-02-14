import { projectDataSchema, type FullProjectData, type Response, type ResponseWithData } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import fs from 'node:fs';
import path from 'node:path';
import { v4 } from 'uuid';
import { z } from 'zod';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';

const schema = z.object({
    uuid: z.string()
});

const create = adminProcedure.PUT.input(projectDataSchema).query(async ({ input }) => {
    const uuid = v4();

    const imageData = path.parse(input.filePath);

    const result = await conn
        .insertInto('project')
        .values({
            uuid,
            name: input.name,
            description: input.description,
            date: new Date(input.date),
            preview: imageData.base,
            image_count: input.images.length
        })
        .executeTakeFirst();

    if (result.numInsertedOrUpdatedRows == 0n) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se vložit projekt'
        } satisfies ErrorApiResponse;
    }

    const root = 'projects';

    const images = [input.filePath, ...input.images];

    fs.mkdirSync(path.join(root, uuid));

    for (const imageId in images) {
        const image = images[imageId];

        const imageData = path.parse(image);

        fs.copyFileSync(path.join(root, imageData.base), path.join(root, uuid, imageData.base));
        fs.unlinkSync(path.join(root, imageData.base));

        if (parseInt(imageId) == 0) continue;

        //insert
        const result = await conn
            .insertInto('project_image')
            .values({
                project: uuid,
                name: imageData.base
            })
            .executeTakeFirst();

        if (result.numInsertedOrUpdatedRows == 0n) {
            return {
                status: false,
                code: 500,
                message: 'Nepodařilo se vložit obrázek'
            } satisfies ErrorApiResponse;
        }
    }

    return {
        status: true,
        data: uuid
    } satisfies ResponseWithData<string>;
});

const getData = adminProcedure.POST.input(schema).query(async ({ input: { uuid } }) => {
    const mainData = await conn.selectFrom('project').selectAll().where('uuid', '=', uuid).executeTakeFirst();

    if (!mainData) {
        return {
            status: false,
            code: 404,
            message: 'Project not found'
        } satisfies ErrorApiResponse;
    }
    try {
        const tags = await conn.selectFrom('project_tags').selectAll().where('uuid', '=', uuid).execute();

        const images = await conn.selectFrom('project_image').selectAll().where('project', '=', uuid).execute();

        return {
            status: true,
            data: {
                ...mainData,
                tags: tags.map((tag) => {
                    return {
                        ...tag,
                        id: undefined
                    };
                }),
                images: images.map((image) => {
                    return {
                        ...image,
                        id: undefined
                    };
                })
            }
        } satisfies ResponseWithData<FullProjectData>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se získat data o projektu'
        } satisfies ErrorApiResponse;
    }
});

const deleteData = adminProcedure.DELETE.input(schema).query(async ({ input: { uuid } }) => {
    const result = await conn.deleteFrom('project').where('uuid', '=', uuid).executeTakeFirst();

    if (result.numDeletedRows == 0n) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se smazat projekt'
        } satisfies ErrorApiResponse;
    }

    fs.rmSync(path.join('projects', uuid), {
        recursive: true
    });

    return {
        status: true
    } satisfies Response;
});

const updateSchema = projectDataSchema.extend({
    uuid: z.string(),
    previewChanged: z.boolean()
});

const updateData = adminProcedure.PATCH.input(updateSchema).query(async ({ input }) => {
    const originalData = await conn.selectFrom('project').selectAll().where('uuid', '=', input.uuid).executeTakeFirst();

    if (!originalData) {
        return {
            status: false,
            code: 404,
            message: 'Projekt nebyl nalezen'
        } satisfies ErrorApiResponse;
    }

    const preview = path.parse(input.filePath);
    if (preview.base != originalData.preview) {
        fs.copyFileSync(path.join('projects', preview.base), path.join('projects', input.uuid, preview.base));
        fs.unlinkSync(path.join('projects', input.uuid, originalData.preview));
    }

    await conn
        .updateTable('project')
        .set({
            name: input.name,
            description: input.description,
            date: new Date(input.date),
            preview: preview.base
        })
        .where('uuid', '=', input.uuid)
        .executeTakeFirst();

    const images = await conn.selectFrom('project_image').selectAll().where('project', '=', input.uuid).execute();
    try {
        //delete old images
        for (const image of images) {
            if (!input.images.includes(image.name)) {
                fs.unlinkSync(path.join('projects', input.uuid, image.name));
                await conn.deleteFrom('project_image').where('id', '=', image.id).executeTakeFirstOrThrow();
            }
        }
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se smazat staré obrázky'
        } satisfies ErrorApiResponse;
    }

    //insert new images
    const newImages = input.images.filter((image) => {
        const p = path.parse(image);

        if (p.dir !== '') {
            return true;
        }

        if (p.root !== '') {
            return true;
        }
        return false;
    });

    try {
        for (const image of newImages) {
            const p = path.parse(image);

            fs.copyFileSync(path.join('projects', p.base), path.join('projects', input.uuid, p.base));
            fs.unlinkSync(path.join('projects', p.base));

            await conn
                .insertInto('project_image')
                .values({
                    project: input.uuid,
                    name: p.base
                })
                .executeTakeFirstOrThrow();
        }
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se vložit nové obrázky'
        } satisfies ErrorApiResponse;
    }

    return {
        status: true
    } satisfies Response;
});

export const get = [create, getData, deleteData, updateData];
