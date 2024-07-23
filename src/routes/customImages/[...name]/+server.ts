import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const formats = ['jpg', 'jpeg', 'png', 'webp', 'tiff'];

export const GET = (async ({ params, setHeaders, url }) => {
    if (params.name == null) {
        throw error(404, 'Not found');
    }

    const fileName = params.name;

    let filePath = path.join('projects', fileName);

    if (!fs.existsSync(filePath)) {
        throw error(404, 'Not found');
    }

    let file = fs.readFileSync(filePath);

    const searchParams = url.searchParams;
    let fileExtension = path.extname(filePath);
    let modified = false;
    let scale = 100;

    if (searchParams.has('format')) {
        const format = searchParams.get('format')!;
        if (!formats.includes(format)) {
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
                throw Error('Invalid downscale value');
            }

            modified = true;
            scale = downScale;
        } catch (_) {
            throw error(400, 'Bad request');
        }
    }

    if (modified) {
        if (!fs.existsSync('.cache')) {
            fs.mkdirSync('.cache');
        }

        const cacheModifiedName = `${path.basename(fileName)}.scale-${scale}.${fileExtension}`;
        const cachePath = path.join('.cache', cacheModifiedName);

        if (!fs.existsSync(cachePath)) {
            let image = sharp(file);

            const imageOptions: sharp.JpegOptions & sharp.PngOptions & sharp.WebpOptions & sharp.TiffOptions = {
                quality: 75
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

            image = image.resize({
                width: newWidth,
                height: newHeight
            });

            const imageBuffer = await image.toBuffer();

            fs.writeFileSync(cachePath, imageBuffer);
        }

        file = fs.readFileSync(cachePath);
        filePath = cachePath;
    }

    const fileInfo = fs.statSync(filePath);

    setHeaders({
        'Content-Type': 'image/' + fileExtension.startsWith('.') ? fileExtension.slice(1) : fileExtension,
        'Content-Length': fileInfo.size.toString(),
        'Last-Modified': fileInfo.mtime.toUTCString(),
        'Cache-Control': 'public, max-age=86400'
    });

    return new Response(file);
}) satisfies RequestHandler;
