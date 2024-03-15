import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Gallery {
  alt: string;
  date: Date;
  id: Generated<number>;
  name: string;
}

export interface Project {
  date: Date;
  description: string;
  image_count: number;
  name: string;
  preview: string;
  uuid: string;
}

export interface ProjectImage {
  id: Generated<number>;
  name: string;
  project: string;
}

export interface ProjectTags {
  tag: number;
  uuid: string;
}

export interface Tag {
  color: string;
  id: Generated<number>;
  name: string;
}

export interface User {
  id: Generated<number>;
  password: string;
  username: string;
}

export interface DB {
  gallery: Gallery;
  project: Project;
  project_image: ProjectImage;
  project_tags: ProjectTags;
  tag: Tag;
  user: User;
}
