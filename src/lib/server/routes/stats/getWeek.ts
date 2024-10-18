import type { ResponseWithData } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { sql } from 'kysely';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';

const endpoint = adminProcedure.GET.query(async () => {
    try {
        const data = await conn
            .selectFrom('visitors')
            .select('id')
            .where(sql<number>`WEEK(CURDATE(), 1)`, '=', sql<number>`WEEK(date, 1)`)
            .groupBy('ip')
            .execute();

        return {
            status: true,
            data: data.length
        } satisfies ResponseWithData<number>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Internal Server Error'
        } satisfies ErrorApiResponse;
    }
});

export default endpoint;
