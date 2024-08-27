import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Equipment {
  id: Generated<number>;
  link: string;
  name: string;
  type: number;
}

export interface EquipmentType {
  id: Generated<number>;
  name: string;
}

export interface Gallery {
  alt: string;
  date: Date;
  id: Generated<number>;
  name: string;
}

export interface GalleryEquipment {
  equipment_id: number;
  gallery_id: number;
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

export interface Visitors {
  date: Generated<Date>;
  id: Generated<number>;
  ip: string;
  page: string;
}

export interface DB {
  equipment: Equipment;
  equipment_type: EquipmentType;
  gallery: Gallery;
  gallery_equipment: GalleryEquipment;
  project: Project;
  project_image: ProjectImage;
  project_tags: ProjectTags;
  tag: Tag;
  user: User;
  visitors: Visitors;
}
