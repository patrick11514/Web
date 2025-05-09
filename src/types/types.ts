import type { ClassValue } from 'svelte/elements';
import type { Account } from './database';
import type { Selectable } from 'kysely';
import type { ErrorApiResponse } from '@patrick115/sveltekitapi';

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
