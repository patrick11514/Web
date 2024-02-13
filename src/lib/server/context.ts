import type { RegularUser } from '$/types/types';
import type { AsyncReturnType, CreateContext } from '@patrick115/sveltekitapi';
import { jwt } from './variables';

export const createContext = (async ({
    cookies
}): Promise<
    | {
          logged: false;
      }
    | {
          logged: true;
          data: RegularUser;
      }
> => {
    const cookie = cookies.get('session');

    if (!cookie) {
        return {
            logged: false
        };
    }

    const data = jwt.getCookie<RegularUser>(cookie);

    if (!data) {
        return {
            logged: false
        };
    }

    return {
        logged: true,
        data
    };
}) satisfies CreateContext;

export type Context = AsyncReturnType<typeof createContext>;
