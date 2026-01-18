import { nina } from '$/lib/server/nina';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const image = await nina.getLiveImage();

  if (!image) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(image, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
};
