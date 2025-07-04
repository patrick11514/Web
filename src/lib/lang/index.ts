import template, { languagable } from './_template';
import czech from './czech';
import english from './english';
import type { z } from 'zod';

export const languages = {
  cs: {
    t: czech,
    flag: '🇨🇿',
    name: 'Čeština'
  },
  en: {
    t: english,
    flag: '🇺🇸',
    name: 'English'
  }
};

export const getPath = (path: string, langs: string[]) => {
  const parts = path.split('/').filter(Boolean);
  if (langs.includes(parts[0])) {
    parts.shift();
  }
  return `/${parts.join('/')}`;
};

type Error = z.infer<typeof template>['errors'];

type Path<$CurrentObject, $Path extends string = ''> = $CurrentObject extends string
  ? $Path // If T is a string, return the accumulated path
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $CurrentObject extends Record<string, any>
    ? {
        [K in keyof $CurrentObject]: Path<$CurrentObject[K], `${$Path}${$Path extends '' ? '' : '.'}${K & string}`>;
      }[keyof $CurrentObject] // Recurse into object keys
    : never;

export type ErrorPath = Path<Error>;
export type LanguagePath = Path<z.infer<typeof template>>;

export const compareErrors = (a: string, b: ErrorPath) => {
  return a === b;
};

export const resolveError = (error: string, lang: z.infer<typeof template>) => {
  let path = lang.errors;
  const parts = error.split('.');

  for (const part of parts) {
    if (path[part as keyof typeof path]) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      path = path[part as keyof typeof path] as any;
    } else {
      // If the path does not exist, return the original error string
      return error;
    }
  }

  return path as unknown as string;
};

export const resolveTranslation = (translation: string, lang: z.infer<typeof template>) => {
  let path = lang;
  const parts = translation.split('.');

  for (const part of parts) {
    if (path[part as keyof typeof path]) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      path = path[part as keyof typeof path] as any;
    } else {
      // If the path does not exist, return the original translation string
      return translation;
    }
  }

  return path as unknown as string;
};

export const replacePlaceholders = (text: string, ...placeholders: string[]) => {
  let i = 1;
  for (const placeholder of placeholders) {
    text = text.replace(`%${i}`, placeholder);
    i++;
  }
  return text;
};

export const resolveLanguagable = (translate: z.infer<typeof languagable>, number: number) => {
  if (number === 1) {
    return translate[1];
  }
  if (number >= 2 && number <= 4) {
    return translate[2];
  }
  return translate.other;
};
