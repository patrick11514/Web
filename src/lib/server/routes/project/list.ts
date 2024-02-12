import { adminProcedure } from '../../api';
import { conn } from '../../variables';

export const list = adminProcedure.GET.query(async () => {
    const data = await conn.selectFrom('project').selectAll().execute();
    return data;
});
