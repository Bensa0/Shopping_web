export interface User {
  id: number | null;
  name: string;
  email: string;
  password: string;
  children?: User[];
  parentId?: number|null,
  roles?:any
}
