import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const GET = (async ({ params, setHeaders }) => {
    if (params.name == null) {
        throw error(404, 'Not found');
    }

    const fileName = params.name;

    const filePath = path.join('projects', fileName);

    if (!fs.existsSync(filePath)) {
        throw error(404, 'Not found');
    }

    const file = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath);
    const fileInfo = fs.statSync(filePath);

    setHeaders({
        'Content-Type': 'image/' + fileExtension.slice(1),
        'Content-Length': fileInfo.size.toString(),
        'Last-Modified': fileInfo.mtime.toUTCString(),
        'Cache-Control': 'public, max-age=600'
    });

    return new Response(file);
}) satisfies RequestHandler;
