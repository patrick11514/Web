import { conn } from '$/lib/server/variables';
import { sql } from 'kysely';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const today = await conn
        .selectFrom('visitors')
        .select('id')
        .where(sql<Date>`DATE(date)`, '=', sql<Date>`CURDATE()`)
        .groupBy('ip')
        .execute();

    const week = await conn
        .selectFrom('visitors')
        .select('id')
        .where(sql<Date>`WEEK(date, 1)`, '=', sql<Date>`WEEK(CURDATE(), 1)`)
        .where(sql<Date>`YEAR(date)`, '=', sql<Date>`YEAR(CURDATE())`)
        .groupBy('ip')
        .execute();

    const weekGraph = await conn
        .selectFrom((eb) =>
            eb
                .selectFrom('visitors')
                .select(['ip', sql<number>`WEEK(date, 1)`.as('WEEK'), sql<number>`YEAR(date)`.as('YEAR')])
                .groupBy([sql`WEEK(date, 1)`, sql`YEAR(date)`, 'ip'])
                .as('t')
        )
        .select(['YEAR', 'WEEK', sql<number>`COUNT(WEEK)`.as('COUNT')])
        .groupBy(['YEAR', 'WEEK'])
        .execute();

    return {
        today: today.length,
        week: week.length,
        weekGraph
    };
}) satisfies PageServerLoad;
