import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const formats = ['jpg', 'jpeg', 'png', 'webp', 'tiff'];

// Cache duration: 1 year in seconds
const CACHE_MAX_AGE = 31536000;

export const GET = (async ({ params, url }) => {
    if (params.name == null) {
        throw error(404, 'Not found');
    }

    const fileName = params.name;

    let filePath = path.join('projects', fileName);

    if (!fs.existsSync(filePath)) {
        throw error(404, 'Not found');
    }

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
            // Use streaming to process the image
            const image = sharp(filePath);

            const imageOptions: sharp.JpegOptions & sharp.PngOptions & sharp.WebpOptions & sharp.TiffOptions = {
                quality: 75
            };

            switch (fileExtension) {
                case 'jpeg':
                case 'jpg':
                    image.jpeg(imageOptions);
                    break;
                case 'png':
                    image.png(imageOptions);
                    break;
                case 'webp':
                    image.webp(imageOptions);
                    break;
                case 'tiff':
                    image.tiff(imageOptions);
                    break;
            }

            const meta = await image.metadata();

            const newWidth = meta.width ? Math.round(meta.width * (scale / 100)) : undefined;
            const newHeight = meta.height ? Math.round(meta.height * (scale / 100)) : undefined;

            image.resize({
                width: newWidth,
                height: newHeight
            });

            await image.toFile(cachePath);
        }

        filePath = cachePath;
    }

    const fileInfo = fs.statSync(filePath);
    const contentType = 'image/' + (fileExtension.startsWith('.') ? fileExtension.slice(1) : fileExtension);

    // Create a readable stream for efficient memory usage
    const stream = fs.createReadStream(filePath);

    // Convert Node.js readable stream to web ReadableStream
    const webStream = new ReadableStream({
        start(controller) {
            stream.on('data', (chunk) => {
                controller.enqueue(chunk);
            });
            stream.on('end', () => {
                controller.close();
            });
            stream.on('error', (err) => {
                controller.error(err);
            });
        },
        cancel() {
            stream.destroy();
        }
    });

    // Return response with headers set early and streaming body
    return new Response(webStream, {
        headers: {
            'Content-Type': contentType,
            'Content-Length': fileInfo.size.toString(),
            'Last-Modified': fileInfo.mtime.toUTCString(),
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`
        }
    });
}) satisfies RequestHandler;
