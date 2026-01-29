import { nina } from '$/lib/server/nina';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, url }) => {
  const data = await parent();

  return {
    meta: {
      title: data.lang.live_photo.title,
      description: data.lang.live_photo.description,
      image: nina.haveImage() ? `${url.origin}/api/live-image` : undefined
    }
  };
}) satisfies PageServerLoad;
