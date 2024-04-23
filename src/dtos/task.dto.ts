import { HateoasLinks } from "./common.dto";

export interface CreateTaskDto {
  title: string;
}

export interface UpdateTaskDto {
  title?: string;
  done?: boolean;
}

export interface TaskDto {
  id: number;
  title: string;
  done: boolean;
  links?: HateoasLinks;
}
