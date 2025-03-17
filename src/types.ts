import { ReactNode } from "react";

export interface Employee {
  role: ReactNode;
  id: number;
  name: ReactNode;
  age: ReactNode;
  position: ReactNode;
  department: ReactNode;
  userId: string;
  jobTitleName: string;
  preferredFullName: string; 
  employeeCode: string;
  region: string; 
  phoneNumber: string;
  emailAddress: string;
}
