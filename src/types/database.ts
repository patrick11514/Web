import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Project {
  date: Date;
  description: string;
  name: string;
  preview: string;
  uuid: Generated<string>;
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
  project: Project;
  project_tags: ProjectTags;
  tag: Tag;
  user: User;
}
