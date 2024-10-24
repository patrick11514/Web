import type { DetailTypes, ResponseWithData } from '$/types/types';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';

const GET = adminProcedure.GET.query(async () => {
    return {
        status: true,
        data: await conn.selectFrom('detail_types').selectAll().execute()
    } satisfies ResponseWithData<DetailTypes[]>;
});

export default [GET];
