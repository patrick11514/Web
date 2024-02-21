import type { ResponseWithData, Tag } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { procedure } from '../api';
import { conn } from '../variables';

export const tags = procedure.GET.query(async () => {
    try {
        const tags = await conn.selectFrom('tag').selectAll().execute();

        return {
            status: true,
            data: tags
        } satisfies ResponseWithData<Tag[]>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se načíst tagy'
        } satisfies ErrorApiResponse;
    }
});
