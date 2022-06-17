import { DataListType, PaginationType } from "./common";
import { DepartmentType } from "./departments";
import { ProfileType, ProfileDataType, UserInfoType, UserType } from "./user";

export type AttendanceDayType = {
  id: string;
  date: string;
  punch_in: string;
  punch_out?: string;
  hours?: number;
} | null;

export type AttendanceWeekType = {
  mon: AttendanceDayType;
  tue: AttendanceDayType;
  wed: AttendanceDayType;
  thu: AttendanceDayType;
  fri: AttendanceDayType;
}

export type AttendanceStatisticsType = {
  today?: number;
  week?: number;
  month?: number;
  remaining?: number;
  overtime?: number;
}

export type AttendanceInfoType = {
  hours_spent_today?: AttendanceDayType;
  overtime_hours?: number;
  week_hours?: AttendanceWeekType;
  statistics?: AttendanceStatisticsType
}

export interface AttendanceListType extends DataListType {
  results: AttendanceType[];
}

export type AttendanceType = {
  id: string;
  date: string;
  punch_in: string;
  punch_out?: string;
  production?: string;
  break?: number;
  overtime?: number;
};

export interface GetEmployeesDataType extends DataListType {
  active: number;
  inactive: number;
  on_leave: number;
  results: EmployeeType[];
}

export type ProfileErrorType = {
  image?: string;
  gender?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  date_of_birth?: string;
};

export type EmployeeType = {
  id: string;
  user: UserType;
  job?: {
    id: string;
    name: string;
  };
  status: "active" | "on leave" | "inactive";
  department?: DepartmentType;
  supervisor?: UserEmployeeType;
  date_employed: string;
  profile: ProfileType;
  active: boolean;
};


export type ErrorFormType =
  {
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
  image?: any;
  first_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
  date_of_birth?: string;
  date_employed?: string;
  job?: string;
  supervisor?: string;
  gender?: string;
  state?: string;
  city?: string;
  phone?: string;
  address?: string;
};

export type FormErrorType = {
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
  profile?: ProfileErrorType;
  job?: {
    id: string;
  };
  department?: {
    id: string;
  };
  supervisor?: {
    id: string;
  };
  date_employed?: string;
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

export interface ContactInfoType
  extends Omit<UserType, "full_name" | "active"> {
  full_name?: string;
  active?: boolean;
  profile: ProfileDataType;
}

export type ClientType = {
  id: string;
  company: string;
  position: string;
  contact: ContactInfoType;
};

export interface ContactCreateInfoType
  extends Omit<UserType, "full_name" | "active"> {
  profile: ProfileErrorType;
}

export interface ClientCreateType extends Omit<ClientType, "id" | "contact"> {
  contact: ContactCreateInfoType;
}

export interface ClientListType extends DataListType {
  active: number;
  inactive: number;
  total: number;
  results: ClientType[];
}

export interface ClientPaginationType extends PaginationType {
  active?: boolean;
}

export type ClientFormErrorType = {
  contact?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  profile?: ProfileErrorType;
  company?: string;
  position?: string;
};

export type HolidayType = {
  id: string;
  name: string;
  date: string;
};

export interface HolidayListType extends DataListType {
  results: HolidayType[];
}

export type HolidayCreateType = Omit<HolidayType, "id">;

export type HolidayErrorType = {
  name?: string;
  date?: string;
};

export interface UserEmployeeType extends UserType {
  id: string;
  job: string;
}

export type ProjectType = {
  id: string;
  client: ClientType;
  leaders: UserEmployeeType[];
  team: UserEmployeeType[];
  created_by: UserEmployeeType;
  name: string;
  start_date: string;
  end_date: string;
  initial_cost: number;
  rate: number;
  priority: string;
  // priority: "H" | "M" | "L";
  description: string;
  completed: boolean;
  is_active: boolean;
  tasks: {
    id: string;
    name: string;
    completed: boolean;
  }[];
  files: ProjectFileType[];
};

export type ProjectCreateType = {
  client?: string;
  leaders: { id: string }[];
  team: { id: string }[];
  name: string;
  start_date: string;
  end_date: string;
  initial_cost: number;
  rate: number;
  priority: string;
  description: string;
};

export type ProjectCreateErrorType = {
  client: string;
  leaders: string;
  team: string;
  name: string;
  start_date: string;
  end_date: string;
  initial_cost: string;
  rate: string;
  priority: string;
  description: string;
};

export interface ProjectListType extends DataListType {
  total?: number;
  completed?: number;
  ongoing?: number;
  results: ProjectType[];
}

export type TaskType = {
  id: string;
  project: {
    id: string;
    name: string;
  };
  completed: boolean;
  verified: boolean;
  name: string;
  description: string;
  priority: string;
  followers: UserEmployeeType[];
  leaders: UserEmployeeType[];
  created_by: UserEmployeeType;
  create_date: string;
  due_date: string;
};

export interface TaskListType extends DataListType {
  project: {
    name: string;
    id: string;
  };
  total: number;
  completed: number;
  verified: number;
  count: number;
  ongoing: number;
  results: TaskType[];
}

export type TaskCreateType = {
  leaders: { id: string }[];
  followers: { id: string }[];
  name: string;
  due_date: string;
  priority: string;
  description: string;
};

export type TaskFormInitStateType = {
  name: string;
  due_date: string;
  priority: string;
  followers: string[];
  leaders: string[];
  description: string;
};

export type TaskCreateErrorType = {
  leaders: string;
  followers: string;
  name: string;
  due_date: string;
  priority: string;
  description: string;
};

export type ProjectFileType = {
  id: number;
  project: {
    id: string;
    name: string;
  };
  name: string;
  file_type: string;
  file: string;
  size: number;
  date: string;
  uploaded_by: {
    name: string;
    id: string;
  };
};

export type ProjectFileCreateType = {
  name: string;
  file: any;
};

export type ProjectFileCreateErrorType = {
  name: string;
  file: string;
};
