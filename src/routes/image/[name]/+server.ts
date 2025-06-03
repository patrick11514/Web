import { error, type RequestHandler } from '@sveltejs/kit';
import Path from 'node:path';
import fs from 'node:fs/promises';
import { FILE_FOLDER } from '$env/static/private';
import sharp from 'sharp';
import { isDirectory, isFile } from '$/lib/server/functions';
import { extensions, type ImageExtension } from '$/types/types';

const CACHE_FOLDER = '.cache';
const DEFAULT_IMAGE_QUALITY = 75;

export const GET = (async ({ params, setHeaders, url }) => {
    if (!params.name) {
        error(400, 'Name is required');
    }

    if (params.name.includes('..')) {
        error(400, 'Bad request');
    }

    const parsed = Path.parse(params.name);
    if (!extensions.includes(parsed.ext.substring(1) as ImageExtension)) {
        error(404, 'File not found');
    }

    if (!(await isDirectory(FILE_FOLDER))) {
        await fs.mkdir(FILE_FOLDER, { recursive: true });
    }

    let filePath = Path.join(FILE_FOLDER, params.name);

    if (!(await isFile(filePath))) {
        error(404, 'File not found');
    }

    let content = await fs.readFile(filePath);

    const searchParams = url.searchParams;
    let fileExtension = Path.extname(filePath).substring(1).toLowerCase();
    let modified = false;
    let scale = 100;

    if (searchParams.has('format')) {
        const format = searchParams.get('format')!;
        if (!extensions.includes(format as ImageExtension)) {
            throw error(400, 'Bad request');
        }

        fileExtension = format;
        modified = true;
    }

    if (searchParams.has('scale')) {
        const downscale = searchParams.get('scale')!;
        try {
            const downScale = parseInt(downscale);
            if (downScale > 100 || downScale < 0) {
                throw error(400, 'Bad request');
            }

            modified = true;
            scale = downScale;
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            throw error(400, 'Bad request');
        }
    }

    if (modified) {
        if (!(await isDirectory(CACHE_FOLDER))) {
            await fs.mkdir(CACHE_FOLDER);
        }

        const cacheModifiedName = `${Path.basename(params.name)}.scale-${scale}.${fileExtension}`;
        const cachePath = Path.join(CACHE_FOLDER, cacheModifiedName);

        if (!(await isFile(cachePath))) {
            let image = sharp(content);

            const imageOptions: sharp.JpegOptions & sharp.PngOptions & sharp.WebpOptions & sharp.TiffOptions = {
                quality: DEFAULT_IMAGE_QUALITY
            };

            switch (fileExtension) {
                case 'jpeg':
                case 'jpg':
                    image = image.jpeg(imageOptions);
                    break;
                case 'png':
                    image = image.png(imageOptions);
                    break;
                case 'webp':
                    image = image.webp(imageOptions);
                    break;
                case 'tiff':
                    image = image.tiff(imageOptions);
                    break;
            }

            const meta = await image.metadata();

            const newWidth = meta.width ? Math.round(meta.width * (scale / 100)) : undefined;
            const newHeight = meta.height ? Math.round(meta.height * (scale / 100)) : undefined;

            image = image.resize(newWidth, newHeight);

            const imageBuffer = await image.toBuffer();
            await fs.writeFile(cachePath, imageBuffer);
        }

        content = await fs.readFile(cachePath);
        filePath = cachePath;
    }
    const fileInfo = await fs.stat(filePath);

    setHeaders({
        'Content-Type': `image/${fileExtension}`,
        'Content-Length': fileInfo.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
    });

    return new Response(content);
}) satisfies RequestHandler;
