import { z } from 'zod';
import type { EquipmentType as DBEquipmentType, Tag as DBTag, User as DBUser, Equipment, Gallery, Project, ProjectImage, ProjectTags } from './database';

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
    tags: Tag[];
};

export type DeArray<T> = T extends (infer U)[] ? U : never;

export type GalleryItem = Omit<Gallery, 'id'> & {
    id: number;
    equipment: EquipmentInfo[];
};

export type EquipmentType = Omit<DBEquipmentType, 'id'> & {
    id: number;
};

export type EquipmentInfo = Omit<Equipment, 'id' | 'type'> & {
    id: number;
    type_id: number;
    type: string;
};

//https://stackoverflow.com/a/54178819
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

//https://stackoverflow.com/a/53050575
export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };
