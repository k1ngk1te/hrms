export type ProfileDataType = {
  image: string;
  address: string;
  gender: {
    name: string;
    value: "M" | "F";
  };
  date_of_birth: string;
  phone: string;
  state: string;
  city: string;
}

export interface ProfileType extends ProfileDataType {
  last_leave_info?: {
    completed: "not approved" | "ongoing" | "completed";
    no_of_days: number;
    start_date: string;
    end_date: string;
  };
  date: string;
}

export interface ProfileFormType
  extends Omit<
    ProfileType,
    "date" | "gender" | "last_leave_info"
  > {
  user: {
    first_name: string;
    last_name: string;
  };
  gender: "M" | "F";
}

export type UserType = {
	image?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  active: boolean;
}


export interface UserInfoType extends UserType {
  job?: string;
  is_admin?: boolean;
  admin_status?: "supervisor" | "hod" | "hr" | "md" | null;
  empId?: string;
  leaves_taken?: number;
leaves_remaining?: number;
punched_in?: boolean;
punched_out?: boolean;
}

export type ChangePasswordType = {
  email?: string;
  password1: string;
  password2: string;
  type?: "client" | "employee";
};
