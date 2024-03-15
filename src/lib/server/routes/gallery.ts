import type { GalleryItem, Response, ResponseWithData } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import fs from 'node:fs';
import Path from 'node:path';
import { z } from 'zod';
import { adminProcedure, procedure } from '../api';
import { conn } from '../variables';

const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.avif', '.tiff', '.webp', '.webm'] as const;

const upload = adminProcedure.POST.input(FormDataInput).query(async ({ input }) => {
    const file = input.get('file') as File | null;
    if (!file) {
        return {
            status: false,
            code: 400,
            message: 'No file provided'
        } satisfies ErrorApiResponse;
    }

    const root = Path.join('projects', 'gallery');

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }

    const path = Path.join(root, file.name);
    const fileName = Path.parse(file.name);

    if (!extensions.includes(fileName.ext as (typeof extensions)[number])) {
        return {
            status: false,
            code: 400,
            message: 'Nahrál jsi neplatný typ souboru'
        } satisfies ErrorApiResponse;
    }

    const buffer = await file.arrayBuffer();

    fs.writeFileSync(path, Buffer.from(buffer));

    return {
        status: true,
        data: '/customImages/gallery/' + file.name
    } satisfies ResponseWithData<string>;
});

const list = procedure.GET.query(async () => {
    try {
        const data = await conn.selectFrom('gallery').select(['name', 'alt']).orderBy('date', 'desc').execute();

        return {
            status: true,
            data
        } satisfies ResponseWithData<GalleryItem[]>;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Internal server error'
        } satisfies ErrorApiResponse;
    }
});

const add = procedure.PUT.input(
    z.object({
        image: z.string(),
        date: z.coerce.date(),
        alt: z.string()
    })
).query(async ({ input }) => {
    const imageData = Path.parse(input.image);

    try {
        conn.insertInto('gallery')
            .values({
                name: imageData.base,
                date: input.date,
                alt: input.alt
            })
            .execute();

        return {
            status: true
        } satisfies Response;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Internal server error'
        } satisfies ErrorApiResponse;
    }
});

export default [upload, list, add];
