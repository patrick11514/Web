import type { ResponseWithData } from '$/types/types';
import type { AsyncReturnType, ErrorApiResponse } from '@patrick115/sveltekitapi';
import { sql } from 'kysely';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';
import { format } from 'date-fns';
import { z } from 'zod';

const getDataForYear = async (year?: number) => {
    try {
        //SELECT WEEK, COUNT(WEEK) AS COUNT FROM (
        //SELECT ip, WEEK(date, 1) as WEEK FROM visitors GROUP BY WEEK(date, 1), ip
        //) AS t GROUP BY WEEK

        let query = conn
            .selectFrom((eb) =>
                eb
                    .selectFrom('visitors')
                    .select(['ip', sql<number>`WEEK(date, 1)`.as('WEEK'), sql<number>`YEAR(date)`.as('YEAR')])
                    .groupBy([sql`WEEK(date, 1)`, 'ip'])
                    .as('t')
            )
            .select(['YEAR', 'WEEK', sql<number>`COUNT(WEEK)`.as('COUNT')]);

        if (year) {
            query = query.where('YEAR', '=', year);
        }

        return await query.groupBy(['YEAR', 'WEEK']).execute();
    } catch (_) {
        return false;
    }
};

const GET = adminProcedure.GET.query(async () => {
    const result = await getDataForYear();

    if (!result) {
        return {
            status: false,
            code: 500,
            message: 'Internal Server Error'
        } satisfies ErrorApiResponse;
    }
    return {
        status: true,
        data: result
    } satisfies ResponseWithData<AsyncReturnType<typeof getDataForYear>>;
});

const POST = adminProcedure.POST.input(z.number()).query(async ({ input }) => {
    const result = await getDataForYear(input);

    if (!result) {
        return {
            status: false,
            code: 500,
            message: 'Internal Server Error'
        } satisfies ErrorApiResponse;
    }
    return {
        status: true,
        data: result
    } satisfies ResponseWithData<AsyncReturnType<typeof getDataForYear>>;
});

export default [GET, POST];
