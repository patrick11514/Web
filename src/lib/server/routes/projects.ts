import type { PublicProjectData, ResponseWithData, Tag } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { procedure } from '../api';
import { conn } from '../variables';

const list = procedure.GET.query(async () => {
    try {
        const data = await conn.selectFrom('project').selectAll().execute();
        const tags = await conn.selectFrom('tag').selectAll().execute();

        const returnData: PublicProjectData[] = [];

        for (const project of data) {
            const result = await conn.selectFrom('project_tags').select('tag').where('uuid', '=', project.uuid).execute();
            const projectTags = result.map((tag) => tag.tag);
            const images = await conn.selectFrom('project_image').select('name').where('project', '=', project.uuid).execute();

            returnData.push({
                ...project,
                tags: tags.filter((tag) => projectTags.includes(tag.id)),
                images: images.map((image) => image.name)
            });
        }

        return {
            status: true,
            data: returnData
        } satisfies ResponseWithData<PublicProjectData[]>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepovedlo se načíst projekty'
        } satisfies ErrorApiResponse;
    }
});

const getOne = procedure.POST.input(
    z.object({
        uuid: z.string()
    })
).query(async ({ input: { uuid } }) => {
    try {
        const project = await conn.selectFrom('project').selectAll().where('uuid', '=', uuid).executeTakeFirst();

        if (!project) {
            return {
                status: false,
                code: 404,
                message: 'Projekt nebyl nalezen'
            } satisfies ErrorApiResponse;
        }

        const images = await conn.selectFrom('project_image').where('project', '=', uuid).select('name').execute();
        const tags = (await conn
            .selectFrom('project_tags')
            .innerJoin('tag', 'project_tags.tag', 'tag.id')
            .select(['id', 'name', 'color'])
            .where('uuid', '=', uuid)
            .execute()) as Tag[];

        return {
            status: true,
            data: {
                ...project,
                images: images.map((image) => image.name),
                tags
            }
        } satisfies ResponseWithData<PublicProjectData>;
    } catch (e) {
        console.log(e);
        return {
            status: false,
            code: 500,
            message: 'Nepovedlo se načíst projekt'
        } satisfies ErrorApiResponse;
    }
});

export const projects = [list, getOne];
