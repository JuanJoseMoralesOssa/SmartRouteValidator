import { ID } from "./ID";

export type DataObject<T> = Partial<T> & {
  id?: ID;
};
