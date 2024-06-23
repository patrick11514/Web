import type { GalleryItem, ResponseWithData } from '$/types/types';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { adminProcedure } from '../../api';
import { conn } from '../../variables';

const endpoint = adminProcedure.POST.input(z.number()).query(async ({ input }) => {
    const galleryItem = await conn
        .selectFrom('gallery')
        .innerJoin('gallery_equipment', 'gallery.id', 'gallery_equipment.gallery_id')
        .innerJoin('equipment', 'gallery_equipment.equipment_id', 'equipment.id')
        .innerJoin('equipment_type', 'equipment.type', 'equipment_type.id')
        .select([
            'gallery.id',
            'gallery.name',
            'gallery.date',
            'gallery.alt',
            'equipment.id as equipment_id',
            'equipment.name as equipment_name',
            'equipment.link',
            'equipment_type.id as type_id',
            'equipment_type.name as type_name'
        ])
        .where('gallery.id', '=', input)
        .execute();

    if (galleryItem.length === 0) {
        return {
            status: false,
            code: 404,
            message: 'Not found'
        } satisfies ErrorApiResponse;
    }

    const first = galleryItem[0];

    return {
        status: true,
        data: {
            id: first.id,
            alt: first.alt,
            name: first.name,
            date: first.date,
            equipment: galleryItem.map((item) => {
                return {
                    id: item.equipment_id,
                    name: item.equipment_name,
                    link: item.link,
                    type: item.type_name,
                    type_id: item.type_id
                };
            })
        }
    } satisfies ResponseWithData<GalleryItem>;
});

export default endpoint;
