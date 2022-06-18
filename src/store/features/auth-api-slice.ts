import baseApi from "./base";
import {
  DATA_LIFETIME,
  LOGIN_URL,
  LOGOUT_URL,
  PASSWORD_CHANGE_URL,
  PROFILE_URL,
  USER_DATA_URL,
} from "../../config";
import { EmployeeType } from "../../types/employees";
import { ProfileFormType, UserInfoType } from "../../types/user";
import { generateProfile } from "../helpers";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{data: UserInfoType}, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: LOGIN_URL,
        method: "POST",
        body: { email: email.toLowerCase(), password },
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
      providesTags: (result) => result ? ["User"] : [],
    }),
    getProfile: build.query<EmployeeType, void>({
      query: () => ({
        url: PROFILE_URL,
        method: "GET",
        credentials: "include"
      }),
      keepUnusedDataFor: DATA_LIFETIME,
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation<
      ProfileFormType,
      { profile: ProfileFormType }
    >({
      query: ({ profile }) => ({
        url: PROFILE_URL,
        method: "PUT",
        headers: {
          "default-content-type": "use-browser-default",
        },
        body: generateProfile(profile),
        credentials: "include"
      }),
      invalidatesTags: (result) => result ? ["Profile", "User"] : [],
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
