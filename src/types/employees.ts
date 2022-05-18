import { DataListType } from "./common";
import { DepartmentType } from "./departments";
import { ProfileType, UserInfoType } from "./user";

export interface GetEmployeesDataType extends DataListType {
  active: number;
  inactive: number;
  on_leave: number;
  results: EmployeeType[];
}

export type EmployeeType = {
  id: string | number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  job?: {
    id: number;
    name: string;
  };
  status: "active" | "on leave" | "inactive";
  department?: DepartmentType;
  supervisor?: number;
  supervisor_info?: UserInfoType;
  date_employed: string;
  profile: ProfileType;
  active: boolean;
};

export type ErrorFormType =
  | {
      image?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      department?: string;
      date_employed?: string;
      date_of_birth?: string;
      job?: string;
      supervisor?: string;
      gender?: string;
      state?: string;
      city?: string;
      phone?: string;
      address?: string;
    }
  | undefined;

export type FormType = {
  image: any;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  date_of_birth: string;
  date_employed: string;
  job: string;
  supervisor: string;
  gender: string;
  state: string;
  city: string;
  phone: string;
  address: string;
};

export type FormErrorType = {
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  profile: {
    image: string;
    gender: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    date_of_birth: string;
  };
  job: {
    id: string;
  };
  department: {
    id: string;
  };
  supervisor: string;
  date_employed: string;
};

export type ErrorsKeyType =
  | "image"
  | "first_name"
  | "last_name"
  | "email"
  | "department"
  | "job"
  | "supervisor"
  | "date_employed"
  | "date_of_birth" 
  | "gender" 
  | "state" 
  | "city" 
  | "phone" 
  | "address";