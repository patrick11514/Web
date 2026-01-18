import type { DB, Translations } from '$/types/database';
import {
  extensions,
  type DePromise,
  type ImageExtension,
  type UserData,
  type UserState
} from '$/types/types';
import { FILE_FOLDER } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { redirect as _redirect } from '@sveltejs/kit';
import type { ControlledTransaction, Insertable } from 'kysely';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import Path from 'node:path';
import { promisify } from 'node:util';
import { v4 } from 'uuid';
import type z from 'zod';
import { languages } from '../lang';
import { getState } from '../state.svelte';
import { conn, jwt } from './variables';

const randomBytesAsync = promisify(crypto.randomBytes);

export const getUserState = (cookies: Cookies): UserState => {
  const session = cookies.get('session');
  if (!session) {
    return {
      logged: false
    };
  }

  const data = jwt.getCookie<UserData>(session);

  if (!data) {
    return {
      logged: false
    };
  }

  return {
    logged: true,
    data
  };
};

type Params = Parameters<typeof _redirect>;

export const redirect = (status: Params[0], location: Params[1]) => {
  const state = getState();
  _redirect(status, `/${state.selectedLang || 'cs'}${location}`);
};

export const isDirectory = async (path: string) => {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

export const isFile = async (path: string) => {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
};

export const uploadFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const path = Path.parse(file.name);

  if (!extensions.includes(path.ext.substring(1) as ImageExtension)) {
    return undefined;
  }

  const name = (await randomBytesAsync(16)).toString('hex') + path.ext;

  if (!(await isDirectory(FILE_FOLDER))) {
    await fs.mkdir(FILE_FOLDER, { recursive: true });
  }

  await fs.writeFile(Path.join(FILE_FOLDER, name), Buffer.from(arrayBuffer));
  return name;
};

export const gatherTranslations = async (
  uuids: string[],
  lang: keyof typeof languages
) => {
  const trans = await conn
    .selectFrom('translations')
    .select(['key', 'text'])
    .where('lang', '=', lang)
    .where('key', 'in', uuids)
    .execute();
  return Object.fromEntries(trans.map((tran) => [tran.key, tran.text]));
};

export const gatherTranslationsAll = async (uuids: string[]) => {
  const keys = Object.keys(languages);

  const resolved = await Promise.all(
    keys.map(async (lang) => gatherTranslations(uuids, lang))
  );

  return Object.fromEntries(resolved.map((tran, idx) => [keys[idx], tran]));
};

export const constructEmptyTranslations = () => {
  const keys = Object.keys(languages);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const translations: Record<(typeof keys)[number], Record<string, string>> = {} as any;
  for (const lang of keys) {
    translations[lang] = {};
  }

  return translations;
};

export type GatheredTranslationsAll = DePromise<ReturnType<typeof gatherTranslationsAll>>;

export const parseFormData = <$DataType>(
  formData: FormData,
  schema: z.ZodType<$DataType>
) => {
  const object = Object.fromEntries(formData.entries());
  //parse objects/arrays
  for (const key in object) {
    const value = object[key];
    if (
      typeof value === 'string' &&
      (value.startsWith('{') || value.startsWith('[') || value.startsWith('"'))
    ) {
      try {
        object[key] = JSON.parse(value);
      } catch {
        // If parsing fails, keep the original string
      }
    }
  }

  //resolve languagable
  //language:key = value

  const groupped = {} as Record<string, Record<string, unknown>>;
  const languagesKeys = Object.keys(languages);

  for (const lang of languagesKeys) {
    groupped[lang] = {};
  }

  for (const key in object) {
    const [lang, subKey] = key.split(':');
    if (lang && subKey && (languagesKeys as string[]).includes(lang)) {
      groupped[lang as keyof typeof languages][subKey] = object[key];
    } else {
      for (const lang of languagesKeys) {
        groupped[lang][key] = object[key];
      }
    }
  }

  //parse search sub-object
  for (const lang in groupped) {
    const subObject = groupped[lang];
    const parsed = schema.parse(subObject);
    groupped[lang] = parsed as Record<string, unknown>;
  }

  return groupped as Record<keyof typeof languages, $DataType>;
};

export const insertTranslations = async <
  $Record extends Record<string, unknown>,
  $Fields extends keyof $Record
>(
  trx: ControlledTransaction<DB>,
  obj: Record<keyof typeof languages, $Record>,
  fields: $Fields[]
) => {
  const result = {} as Record<$Fields, string>;
  const toInsert = [] as Insertable<Translations>[];

  const langs = Object.keys(obj);
  for (const field of fields) {
    const uuid = v4();
    for (const lang of langs) {
      toInsert.push({
        key: uuid,
        lang: lang,
        text: obj[lang][field] as string
      });
      result[field] = uuid;
    }
  }

  await trx.insertInto('translations').values(toInsert).execute();

  return result;
};

export const updateTranslations = async <
  $Record extends Record<string, unknown>,
  $Fields extends keyof $Record
>(
  trx: ControlledTransaction<DB>,
  originalData: Partial<Record<$Fields, string | null>>,
  parsed: Record<keyof typeof languages, $Record>,
  fields: readonly $Fields[] | $Fields[]
): Promise<boolean> => {
  let somethingUpdated = false;
  const languagesKeys = Object.keys(languages);

  for (const field of fields) {
    const uuid = originalData[field];
    if (!uuid) continue;

    for (const lang of languagesKeys) {
      const newText = parsed[lang]?.[field];
      if (newText && typeof newText === 'string') {
        somethingUpdated = true;
        await trx
          .insertInto('translations')
          .values({
            key: uuid,
            lang: lang,
            text: newText
          })
          .onDuplicateKeyUpdate({
            text: newText
          })
          .execute();
      }
    }
  }

  return somethingUpdated;
};
