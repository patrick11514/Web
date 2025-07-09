import { extensions, type ImageExtension, type UserData, type UserState } from '$/types/types';
import type { Cookies } from '@sveltejs/kit';
import { conn, jwt } from './variables';
import { redirect as _redirect } from '@sveltejs/kit';
import { getState } from '../state.svelte';
import fs from 'node:fs/promises';
import Path from 'node:path';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { FILE_FOLDER } from '$env/static/private';
import type { languages } from '../lang';

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

export const gatherTranslations = async (uuids: string[], lang: keyof typeof languages) => {
  const trans = await conn.selectFrom('translations').select(['key', 'text']).where('lang', '=', lang).where('key', 'in', uuids).execute();
  return Object.fromEntries(trans.map((tran) => [tran.key, tran.text]));
};
