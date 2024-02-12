import type { User as DBUser, Project } from './database';

export type User = Omit<DBUser, 'id'> & {
    id: number;
};

export type ProjectType = Omit<Project, 'uuid'> & {
    uuid: string;
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

export type Response = {
    status: true;
};

export type ResponseWithData<T> = {
    status: true;
    data: T;
};
