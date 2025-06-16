import fs from 'node:fs/promises';
import Path from 'node:path';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { conn } from '../variables';
import type { Response } from '$/types/types';
import { v4 } from 'uuid';
import type { ErrorPath } from '$/lib/lang';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { FILE_FOLDER } from '$env/static/private';
import { articleSchema } from '$/types/schemes';

export default [
    loggedProcedure.POST.input(articleSchema).query(async ({ input }) => {
        const trx = await conn.startTransaction().execute();

        try {
            const uuid = v4();

            await trx
                .insertInto('article')
                .values({
                    id: uuid,
                    title: input.title,
                    content_md: input.content_md
                })
                .execute();

            //equipment
            if (input.equipment.length > 0) {
                await trx
                    .insertInto('article_equipment')
                    .values(
                        input.equipment.map((eq) => ({
                            article_id: uuid,
                            equipment_id: eq
                        }))
                    )
                    .execute();
            }

            //images
            if (input.images.length > 0) {
                await trx
                    .insertInto('gallery_image')
                    .values(
                        input.images.map((image) => ({
                            ...image,
                            article_id: uuid
                        }))
                    )
                    .execute();
            }

            //exposures
            if (input.exposures.length > 0) {
                await trx
                    .insertInto('exposure')
                    .values(
                        input.exposures.map((exposure) => ({
                            ...exposure,
                            article_id: uuid
                        }))
                    )
                    .execute();
            }

            await trx.commit().execute();
            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);
            await trx.rollback().execute();

            return {
                status: false,
                code: 500,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }
    }),
    loggedProcedure.PUT.input(articleSchema.required()).query(async ({ input }) => {
        const originalData = await conn.selectFrom('article').selectAll().where('id', '=', input.id).executeTakeFirst();
        if (!originalData) {
            return {
                status: false,
                code: 404,
                message: 'article.notFound' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        const trx = await conn.startTransaction().execute();

        try {
            let someChanged = false;
            //compare original data with input
            if (originalData.title !== input.title || originalData.content_md !== input.content_md) {
                someChanged = true;
                await trx
                    .updateTable('article')
                    .set({
                        title: input.title,
                        content_md: input.content_md
                    })
                    .execute();
            }

            //equipment
            const originalEquipment = await conn.selectFrom('article_equipment').select(['equipment_id']).where('article_id', '=', input.id).execute();
            const ids = originalEquipment.map((eq) => eq.equipment_id);
            const toAdd = input.equipment.filter((eq) => !ids.includes(eq));
            const toRemove = originalEquipment.filter((eq) => !input.equipment.includes(eq.equipment_id));

            if (toAdd.length > 0) {
                someChanged = true;
                await trx
                    .insertInto('article_equipment')
                    .values(
                        toAdd.map((eq) => ({
                            article_id: input.id,
                            equipment_id: eq
                        }))
                    )
                    .execute();
            }

            if (toRemove.length > 0) {
                someChanged = true;
                await trx
                    .deleteFrom('article_equipment')
                    .where('article_id', '=', input.id)
                    .where(
                        'equipment_id',
                        'in',
                        toRemove.map((eq) => eq.equipment_id)
                    )
                    .execute();
            }
            //images
            const originalImages = await conn.selectFrom('gallery_image').select(['name']).where('article_id', '=', input.id).execute();
            const imageNames = originalImages.map((img) => img.name);
            const toAddImages = input.images.filter((img) => !imageNames.includes(img.name));
            const toRemoveImages = originalImages.filter((img) => !input.images.some((_img) => _img.name === img.name));

            if (toAddImages.length > 0) {
                someChanged = true;
                await trx
                    .insertInto('gallery_image')
                    .values(
                        toAddImages.map((image) => ({
                            ...image,
                            article_id: input.id
                        }))
                    )
                    .execute();
            }

            if (toRemoveImages.length > 0) {
                someChanged = true;
                await trx
                    .deleteFrom('gallery_image')
                    .where('article_id', '=', input.id)
                    .where(
                        'name',
                        'in',
                        toRemoveImages.map((img) => img.name)
                    )
                    .execute();
            }

            //exposures
            const originalExposures = await conn.selectFrom('exposure').select(['id']).where('article_id', '=', input.id).execute();
            const exposureIds = originalExposures.map((exp) => exp.id);
            const toAddExposures = input.exposures.filter((exp) => exp.id === undefined || !exposureIds.includes(exp.id));
            const toRemoveExposures = originalExposures.filter((exp) => !input.exposures.some((_exp) => _exp.id === exp.id));

            if (toAddExposures.length > 0) {
                await trx
                    .insertInto('exposure')
                    .values(
                        toAddExposures.map((exposure) => ({
                            ...exposure,
                            article_id: input.id
                        }))
                    )
                    .execute();
            }

            if (toRemoveExposures.length > 0) {
                await trx
                    .deleteFrom('exposure')
                    .where('article_id', '=', input.id)
                    .where(
                        'id',
                        'in',
                        toRemoveExposures.map((exp) => exp.id)
                    )
                    .execute();
            }

            if (someChanged) {
                await trx
                    .updateTable('article')
                    .set({
                        updated_at: new Date()
                    })
                    .where('id', '=', input.id)
                    .execute();
            }

            await trx.commit().execute();
            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);
            await trx.rollback().execute();

            return {
                status: false,
                code: 500,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }
    }),
    loggedProcedure.DELETE.input(z.string()).query(async ({ input }) => {
        const trx = await conn.startTransaction().execute();
        try {
            //equipment
            await trx.deleteFrom('article_equipment').where('article_id', '=', input).execute();
            //exposures
            await trx.deleteFrom('exposure').where('article_id', '=', input).execute();
            //images
            const images = await conn.selectFrom('gallery_image').select(['name']).where('article_id', '=', input).execute();
            await trx.deleteFrom('gallery_image').where('article_id', '=', input).execute();
            //remove images
            const imgPaths = images.map((img) => Path.join(FILE_FOLDER, img.name));
            await Promise.all(imgPaths.map(async (path) => fs.unlink(path).catch(() => {})));

            await trx.deleteFrom('article').where('id', '=', input).execute();

            await trx.commit().execute();

            return {
                status: true
            } satisfies Response;
        } catch (err) {
            console.error(err);

            await trx.rollback().execute();

            return {
                status: false,
                code: 500,
                message: 'internal' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }
    })
];
