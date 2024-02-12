import type { User as DBUser } from './database';

export type User = Omit<DBUser, 'id'> & {
    id: number;
};

export type RegularUser = Omit<User, 'password'>;

export type LoginData =
    | {
          logged: false;
      }
    | {
          logged: true;
          data: RegularUser;
      };

export type ResponseWithData<T> = {
    status: true;
    data: T;
};
