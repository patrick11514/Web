import type { EquipmentType, ResponseWithData } from '$/types/types';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';

const endpoint = adminProcedure.GET.query(async () => {
    const types = await conn.selectFrom('equipment_type').selectAll().execute();

    return {
        status: true,
        data: types
    } satisfies ResponseWithData<EquipmentType[]>;
});

export default endpoint;
