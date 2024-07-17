import { Task } from "../tasks/tasks";

export interface User {
    id?:string | null;
    uuid?:string | null;
    userName?: string |null;
    tasks?: Task[] | null;
    role?: string | null;
    password?: string | null;
    managedUsers?: string[] |null;
    hasManager?: boolean |null;
    email?: string |null;
  }