import type { ErrorApiResponse } from '@patrick115/sveltekitapi';
import type { Selectable } from 'kysely';
import type { ClassValue } from 'svelte/elements';
import type { Account } from './database';

export type FormElement<$Attrs> = {
  class?: ClassValue;
  error?: string;
} & $Attrs;

export type UserData = Omit<Selectable<Account>, 'password'>;

export type UserState =
  | {
      logged: false;
    }
  | {
      logged: true;
      data: UserData;
    };

export type ActionsResponse = Omit<ErrorApiResponse, 'code'>;

export type Response = {
  status: true;
};

export type ResponseWithData<$Data> = Response & {
  data: $Data;
};

export type ImageExtension = 'jpg' | 'jpeg' | 'png' | 'webp' | 'tiff';
export const extensions = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'tiff'
] satisfies ImageExtension[];

export type DePromise<$Promise> =
  $Promise extends Promise<infer $Inner> ? $Inner : $Promise;

//Ty chatGPT :)
export type Path<
  T,
  P extends string = '',
  Depth extends number[] = [] // depth counter
> = Depth['length'] extends 5 // <-- limit depth to 5 levels (adjust as needed)
  ? P
  : T extends string | number | boolean
    ? P
    : //eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends Record<string, any>
      ? {
          [K in keyof T]: Path<
            T[K],
            `${P}${P extends '' ? '' : '.'}${K & string}`,
            [...Depth, 1] // increase depth
          >;
        }[keyof T]
      : P;

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NROT = <$Type extends readonly any[]>(array: $Type) => array as [...$Type];
