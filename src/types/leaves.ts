import { DataListType } from "./common";
import { UserEmployeeType } from "./employees";

type StatusType = "approved" | "denied" | "expired" | "not needed" | "pending";

export type FormType = {
  employee?: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  no_of_days?: number;
  reason: string;
};

export type FormErrorType = {
  employee?: string;
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
}

export type LeaveType = {
  id: string;
  user: UserEmployeeType;
  leave_type: {
    name: string;
    value: string;
  };
  authorized: {
    supervisor: StatusType;
		hod: StatusType;
		hr: StatusType;
		md: StatusType;
  };
  status: StatusType;
  admin_status?: StatusType;
  start_date: string;
  end_date: string;
  resume_date: string;
  no_of_days: number;
  reason: string;
  date_updated: string;
  date_requested: string;
};

export interface GetLeavesDataType extends DataListType {
  approved_count: number;
  denied_count: number;
  pending_count: number;
  results: LeaveType[];
} 

export type OvertimeType = {
  id: string;
  user: UserEmployeeType;
  overtime_type: {
    name: string;
    value: string;
  };
  status: StatusType;
  admin_status?: StatusType;
  date: string;
  hours: number;
  reason: string;
  authorized: {
    supervisor: StatusType;
    hod: StatusType;
    hr: StatusType;
    md: StatusType;
  };
  date_updated: string;
  date_requested: string;
}

export interface OvertimeListType extends DataListType {
  approved_count: number;
  denied_count: number;
  pending_count: number;
  results: OvertimeType[];
} 

export type OvertimeCreateType = {
  employee?: string;
  overtime_type: string;
  date: string;
  hours: number;
  reason: string;
}

export type OvertimeCreateErrorType = {
  employee?: string;
  overtime_type?: string;
  date?: string;
  hours?: string;
  reason?: string;
}
