import { error, type RequestHandler } from '@sveltejs/kit';
import Path from 'node:path';
import fs from 'node:fs/promises';
import { FILE_FOLDER } from '$env/static/private';
import sharp from 'sharp';
import { isDirectory, isFile } from '$/lib/server/functions';
import { extensions, type ImageExtension } from '$/types/types';

const CACHE_FOLDER = '.cache';
const DEFAULT_IMAGE_QUALITY = 75;

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

  let content: Buffer;

  if (modified) {
    if (!(await isDirectory(CACHE_FOLDER))) {
      await fs.mkdir(CACHE_FOLDER);
    }

    const cacheModifiedName = `${Path.basename(params.name)}.scale-${scale}.${fileExtension}`;
    const cachePath = Path.join(CACHE_FOLDER, cacheModifiedName);

    if (!(await isFile(cachePath))) {
      //here we don't want to assign the out of scope variable `content`
      const content = await fs.readFile(filePath);
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

    if (memoryCache.get(cachePath)) {
      content = memoryCache.get(cachePath)!;
    } else {
      content = await fs.readFile(cachePath);
      memoryCache.set(cachePath, content);
    }
    filePath = cachePath;
  } else {
    if (memoryCache.get(filePath)) {
      content = memoryCache.get(filePath)!;
    } else {
      content = await fs.readFile(filePath);
      memoryCache.set(filePath, content);
    }
  }
  const fileInfo = await fs.stat(filePath);

  setHeaders({
    'Content-Type': `image/${fileExtension}`,
    'Content-Length': fileInfo.size.toString(),
    'Cache-Control': 'public, max-age=31536000, immutable'
  });

  return new Response(content);
}) satisfies RequestHandler;
