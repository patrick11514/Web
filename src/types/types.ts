import { z } from 'zod';
import type { Tag as DBTag, User as DBUser, Project, ProjectImage, ProjectTags } from './database';

export type User = Omit<DBUser, 'id'> & {
    id: number;
};

export type ProjectType = Omit<Project, 'uuid'> & {
    uuid: string;
};

export type RegularUser = Omit<User, 'password'>;

export type Tag = Omit<DBTag, 'id'> & {
    id: number;
};

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

export const projectDataSchema = z.object({
    filePath: z.string({
        required_error: 'Nenahrál jsi náhled projektu'
    }),
    name: z.string().min(3, 'Jméno projektu musí mít minimálně 3 znaky').max(255, 'Jméno projektu musí mít maximálně 255 znaků'),
    description: z.string().min(3, 'Popis projektu musí mít minimálně 3 znaky').max(1024, 'Popis projektu musí mít maximálně 1024 znaků'),
    images: z.array(z.string()),
    date: z.coerce.date({
        required_error: 'Vyplň datum, kdy byl projekt dokončen'
    })
});

export type ProjectData = z.infer<typeof projectDataSchema>;

export type FullProjectData = ProjectType & {
    images: Omit<ProjectImage, 'id'>[];
    tags: Omit<ProjectTags, 'id'>[];
};

export type PublicProjectData = ProjectType & {
    images: string[];
    tags: Omit<Tag, 'id'>[];
};
