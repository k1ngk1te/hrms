import baseApi from "./base";
import {
  LOGIN_URL,
  LOGOUT_URL,
  PASSWORD_CHANGE_URL,
  PROFILE_URL,
  USER_DATA_URL,
} from "@/config";
import { EmployeeType } from "../../types/employees";
import { ProfileFormType, UserInfoType } from "../../types/user";

const generateForm = (profile: ProfileFormType) => {
  const form = new FormData();
  form.append("image", profile.image);
  form.append("user.first_name", profile.user.first_name);
  form.append("user.last_name", profile.user.last_name);
  form.append("gender", profile.gender);
  form.append("address", profile.address);
  form.append("phone", profile.phone);
  form.append("state", profile.state);
  form.append("city", profile.city);
  form.append("date_of_birth", profile.date_of_birth);
  return form;
};

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{data: UserInfoType}, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: LOGIN_URL,
        method: "POST",
        body: { email, password },
      }),
    }),
    logout: build.mutation<{ detail: string }, void>({
      query: () => ({
        url: LOGOUT_URL,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),
    userData: build.query<{data: UserInfoType}, void>({
      query: () => ({
        url: USER_DATA_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getProfile: build.query<EmployeeType, void>({
      query: () => ({
        url: PROFILE_URL,
        method: "GET",
        credentials: "include"
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation<
      ProfileFormType,
      { profile: ProfileFormType }
    >({
      query: ({ profile }) => ({
        url: PROFILE_URL,
        method: "PUT",
        body: generateForm(profile),
        credentials: "include"
      }),
      invalidatesTags: (result) => result ? ["Profile"] : [],
    }),
    changePassword: build.mutation<
      { detail: string },
      { password1: string; password2: string }
    >({
      query: ({ password1, password2 }) => ({
        url: PASSWORD_CHANGE_URL,
        method: "POST",
        body: { new_password1: password1, new_password2: password2 },
        credentials: "include"
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUserDataQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
