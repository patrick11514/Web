import type { ResponseWithData } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import fs from 'node:fs';
import path from 'node:path';
import { adminProcedure } from '../api';

const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.avif', '.tiff', '.webp', '.webm'] as const;

export const upload = adminProcedure.POST.input(FormDataInput).query(async ({ input }) => {
    const file = input.get('file') as File | null;

    if (!file) {
        return {
            status: false,
            code: 400,
            message: 'Nenahrál jsi žádný soubor'
        } satisfies ErrorApiResponse;
    }

    const fileName = path.parse(file.name);

    if (!extensions.includes(fileName.ext as (typeof extensions)[number])) {
        return {
            status: false,
            code: 400,
            message: 'Nahrál jsi neplatný typ souboru'
        } satisfies ErrorApiResponse;
    }

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(path.join('projects', file.name), Buffer.from(buffer));

    return {
        status: true,
        data: path.join('/customImages', file.name)
    } satisfies ResponseWithData<string>;
});
