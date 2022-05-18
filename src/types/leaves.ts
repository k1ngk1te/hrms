import { DataListType } from "./common";
import { UserInfoType } from "./user";

type StatusType = "approved" | "denied" | "expired" | "not needed" | "pending";

export type FormType = {
  employee?: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  no_of_days?: number;
  reason: string;
};

export type LeaveType = {
  id: string | number;
  user: UserInfoType;
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