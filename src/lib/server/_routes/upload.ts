import { FormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import { loggedProcedure } from '../api';
import type { ErrorPath } from '$/lib/lang';
import { isFile, uploadFile } from '../functions';
import type { Response, ResponseWithData } from '$/types/types';
import { z } from 'zod';
import fs from 'node:fs/promises';
import Path from 'node:path';
import { FILE_FOLDER } from '$env/static/private';

export default [
    loggedProcedure.POST.input(FormDataInput).query(async ({ input }) => {
        const file = input.get('file');

        if (file === null) {
            return {
                status: false,
                code: 400,
                message: 'upload.missing' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        if (!(file instanceof File)) {
            return {
                status: false,
                code: 400,
                message: 'upload.invalidFile' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        try {
            const imageName = await uploadFile(file);

            if (!imageName) {
                return {
                    status: false,
                    code: 400,
                    message: 'upload.invalidFile' satisfies ErrorPath
                } satisfies ErrorApiResponse;
            }

            return {
                status: true,
                data: imageName
            } satisfies ResponseWithData<string>;
        } catch (e) {
            console.error(e);
            return {
                status: false,
                code: 500,
                message: 'upload.error' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }
    }),
    loggedProcedure.DELETE.input(z.string()).query(async ({ input }) => {
        const path = Path.join(FILE_FOLDER, input);

        if (!(await isFile(path))) {
            return {
                status: false,
                code: 404,
                message: 'upload.notFound' satisfies ErrorPath
            } satisfies ErrorApiResponse;
        }

        await fs.unlink(path);

        return {
            status: true
        } satisfies Response;
    })
];
