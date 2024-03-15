import { ORIGIN } from '$env/static/private';
import fs from 'node:fs';
import type { RequestHandler } from './$types';

const date = fs.statSync('package.json').atime;

const urls = ['/', '/projects', '/contact', '/about', '/gallery'];

export const GET = (({ setHeaders }) => {
    setHeaders({ 'Content-Type': 'text/xml' });

    let XML =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    for (const url of urls) {
        XML += `<url><loc>${ORIGIN}${url}</loc><lastmod>${date.toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>\n`;
    }

    XML += '</urlset>';

    return new Response(XML);
}) satisfies RequestHandler;
