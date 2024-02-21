import type { PublicProjectData, ResponseWithData } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { procedure } from '../api';
import { conn } from '../variables';

export const projects = procedure.GET.query(async () => {
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
                tags: tags
                    .filter((tag) => projectTags.includes(tag.id))
                    .map((tag) => {
                        return {
                            ...tag,
                            id: undefined
                        };
                    }),
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
