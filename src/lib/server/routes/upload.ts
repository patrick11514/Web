import type { Response, ResponseWithData } from '$/types/types';
import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { adminProcedure } from '../api';

const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.avif', '.tiff', '.webp', '.webm'] as const;

const create = adminProcedure.POST.input(FormDataInput).query(async ({ input }) => {
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

    if (!fs.existsSync('projects')) {
        fs.mkdirSync('projects');
    }

    let filePath = path.join('projects', file.name);
    let finalFileName = file.name;

    if (fs.existsSync(filePath)) {
        const fileData = path.parse(file.name);
        const bytes = crypto.randomBytes(4).toString('hex');

        finalFileName = `${fileData.name}.${bytes}${fileData.ext}`;

        filePath = path.join('projects', finalFileName);
    }

    fs.writeFileSync(filePath, Buffer.from(buffer));

    return {
        status: true,
        data: path.join('/customImages', finalFileName)
    } satisfies ResponseWithData<string>;
});

const remove = adminProcedure.DELETE.input(
    z.object({
        name: z.string()
    })
).query(async ({ input: { name } }) => {
    const filePath = path.join('projects', name);

    if (!fs.existsSync(filePath)) {
        return {
            status: false,
            code: 404,
            message: 'Soubor neexistuje'
        } satisfies ErrorApiResponse;
    }

    try {
        fs.unlinkSync(filePath);

        return {
            status: true
        } satisfies Response;
    } catch (_) {
        return {
            status: false,
            code: 500,
            message: 'Nepodařilo se smazat soubor'
        } satisfies ErrorApiResponse;
    }
});

export const upload = [create, remove];
