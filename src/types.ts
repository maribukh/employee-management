import { ReactNode } from "react";

export interface Employee {
  id: number;
  age: ReactNode;
  position: ReactNode;
  name: string;
  department: string;
  role: string;
}
