import { languages } from '$/lib/lang';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is keyof typeof languages => {
  return Object.keys(languages).includes(param as keyof typeof languages);
}) satisfies ParamMatcher;
