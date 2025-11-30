import { error, type RequestHandler } from '@sveltejs/kit';
import Path from 'node:path';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { FILE_FOLDER } from '$env/static/private';
import sharp from 'sharp';
import { isDirectory, isFile } from '$/lib/server/functions';
import { extensions, type ImageExtension } from '$/types/types';

const CACHE_FOLDER = '.cache';
const DEFAULT_IMAGE_QUALITY = 75;

// Long cache duration - 1 year in seconds
const CACHE_MAX_AGE = 31536000;

type CacheEntry = {
  buffer: Buffer;
  timestamp: number;
};

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxEntries = 500;
  private maxSize = 200 * 1024 * 1024; // 200 MB

  private getCacheSize(): number {
    let size = 0;
    for (const value of this.cache.values()) {
      size += value.buffer.length;
    }
    return size;
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    entry.timestamp = Date.now();
    return entry.buffer;
  }

  set(key: string, value: Buffer) {
    if (this.getCacheSize() + value.length > this.maxSize || this.cache.size >= this.maxEntries) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) {
        this.cache.delete(oldest[0]);
      }
    }

    this.cache.set(key, {
      buffer: value,
      timestamp: Date.now()
    });
  }
}

const memoryCache = new MemoryCache();

/**
 * Build common cache headers for image responses
 */
function getCacheHeaders(fileExtension: string, contentLength: number, etag: string) {
  return {
    'Content-Type': `image/${fileExtension}`,
    'Content-Length': contentLength.toString(),
    'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
    ETag: etag,
    Vary: 'Accept'
  };
}

/**
 * Convert Node.js readable stream to web ReadableStream
 */
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    }
  });
}

export const GET = (async ({ params, url, request }) => {
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

  const searchParams = url.searchParams;
  let fileExtension = Path.extname(filePath).substring(1).toLowerCase();
  let modified = false;
  let scale = 100;

  if (searchParams.has('format')) {
    const format = searchParams.get('format')!;
    if (!extensions.includes(format as ImageExtension)) {
      error(400, 'Bad request');
    }

    fileExtension = format;
    modified = true;
  }

  if (searchParams.has('scale')) {
    const downscale = searchParams.get('scale')!;
    try {
      const downScale = parseInt(downscale);
      if (downScale > 100 || downScale < 0) {
        error(400, 'Bad request');
      }

      modified = true;
      scale = downScale;
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      error(400, 'Bad request');
    }
  }

  if (modified) {
    if (!(await isDirectory(CACHE_FOLDER))) {
      await fs.mkdir(CACHE_FOLDER);
    }

    const cacheModifiedName = `${Path.basename(params.name)}.scale-${scale}.${fileExtension}`;
    const cachePath = Path.join(CACHE_FOLDER, cacheModifiedName);

    // Check if we need to generate the cached version
    if (!(await isFile(cachePath))) {
      const originalContent = await fs.readFile(filePath);
      let image = sharp(originalContent);

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
      memoryCache.set(cachePath, imageBuffer);
    }

    filePath = cachePath;
  }

  // Get file info for ETag and Content-Length
  const fileInfo = await fs.stat(filePath);
  const etag = `"${fileInfo.mtime.getTime().toString(16)}-${fileInfo.size.toString(16)}"`;

  // Check for conditional request (If-None-Match)
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: getCacheHeaders(fileExtension, fileInfo.size, etag)
    });
  }

  // Check memory cache first
  const cachedContent = memoryCache.get(filePath);
  if (cachedContent) {
    return new Response(cachedContent, {
      headers: getCacheHeaders(fileExtension, cachedContent.length, etag)
    });
  }

  // Stream the file for non-cached content
  const fileStream = createReadStream(filePath);
  const webStream = nodeStreamToWebStream(fileStream);

  // Read and cache the file in the background for future requests
  fs.readFile(filePath)
    .then((buffer) => {
      memoryCache.set(filePath, buffer);
    })
    .catch(() => {
      // Silently ignore background caching errors - the file was already streamed successfully
    });

  return new Response(webStream, {
    headers: getCacheHeaders(fileExtension, fileInfo.size, etag)
  });
}) satisfies RequestHandler;
