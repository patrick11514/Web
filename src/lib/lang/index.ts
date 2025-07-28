import type { Path } from '$/types/types';
import { resolveObject } from '../functions';
import type { GatheredTranslationsAll } from '../server/functions';
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

export type ErrorPath = Path<Error>;
export type LanguagePath = Path<z.infer<typeof template>>;

export const compareErrors = (a: string, b: ErrorPath) => {
  return a === b;
};

export const resolveError = (error: string, lang: z.infer<typeof template>) => {
  return resolveObject(error, lang.error);
};

export const resolveTranslation = (
  translation: string,
  lang: z.infer<typeof template>
) => {
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

export const resolveLanguagable = (
  translate: z.infer<typeof languagable>,
  number: number
) => {
  if (number === 1) {
    return translate[1];
  }
  if (number >= 2 && number <= 4) {
    return translate[2];
  }
  return translate.other;
};

//Resolve arrays and sub objects
export const transformIntoLanguagable = <$Object extends object>(
  object: $Object,
  gathered: GatheredTranslationsAll
): Record<keyof typeof languages, $Object> => {
  const result: Record<string, $Object> = {};

  for (const _lang in languages) {
    const lang = _lang as keyof typeof languages;

    const baseObject = structuredClone(object);
    const currentLang = gathered[lang];

    const translateObject = (obj: Record<string, unknown>) => {
      for (const key in obj) {
        const value = obj[key];
        if (
          value === null ||
          value === undefined ||
          (typeof value !== 'object' && typeof value !== 'string')
        ) {
          continue;
        }

        if (Array.isArray(value)) {
          obj[key] = value.map(translateObject);
          continue;
        }

        if (typeof value === 'object') {
          translateObject(obj[key] as Record<string, unknown>);
          continue;
        }

        const translated = currentLang[value];

        if (!translated) {
          obj[key] = '';
          continue;
        }
        obj[key] = translated;
      }

      return obj;
    };

    translateObject(baseObject as Record<string, unknown>);

    result[lang] = baseObject as $Object;
  }

  return result;
};
