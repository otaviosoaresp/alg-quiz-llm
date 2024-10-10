import { Tag } from "./tag";

export interface Algorithm {
  readonly id: number;
  name: string;
  description: string;
  solution_code: string;
  tags: Tag[];
  readonly created_at: string;
  readonly updated_at: string;
}