export type ProfileType = {
  image: string;
  image_url?: string;
  address: string;
  gender: {
    name: string;
    value: "M" | "F";
  };
  marital_status: {
    name: "single" | "married" | "divorced";
    value: "S" | "M" | "D";
  };
  last_leave_info?: {
    completed: "not approved" | "ongoing" | "completed";
    no_of_days: number;
    start_date: string;
    end_date: string;
  };
  date_of_birth: string;
  phone: string;
  state: string;
  city: string;
  date: string;
};

export interface ProfileFormType
  extends Omit<
    ProfileType,
    "date" | "gender" | "marital_status" | "last_leave_info"
  > {
  user: {
    first_name: string;
    last_name: string;
  };
  image_url?: string;
  gender: "M" | "F";
  marital_status: "S" | "M" | "D";
}

export type UserInfoType = {
  image?: string;
  first_name: string;
  last_name: string;
  email: string;
  job?: string;
  is_admin?: boolean;
  admin_status?: "supervisor" | "hod" | "hr" | "md" | null;
  empId: number;
  leaves_taken?: number;
	leaves_remaining?: number;
  active: boolean;
};

export type ChangePasswordType = {
  email?: string;
  password1: string;
  password2: string;
};
