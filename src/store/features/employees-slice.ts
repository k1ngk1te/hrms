import { baseApi } from "./base";
import {
	ATTENDANCE_URL,
	ATTENDANCE_INFO_URL,
	DATA_LIFETIME,
	CLIENT_URL,
	CLIENTS_URL,
	EMPLOYEE_URL,
	EMPLOYEES_URL,
	EMPLOYEE_DEACTIVATE_URL,
	EMPLOYEE_PASSWORD_CHANGE_URL,
	HOLIDAY_URL,
	HOLIDAYS_URL,
} from "../../config";
import { PaginationType } from "../../types/common";
import {
	AttendanceType,
	AttendanceInfoType,
	AttendanceListType,
	GetEmployeesDataType,
	ClientType,
	ClientCreateType,
	ClientListType,
	ClientPaginationType,
	EmployeeType,
	FormType,
	HolidayType,
	HolidayCreateType,
	HolidayListType,
} from "../../types/employees";
import { ChangePasswordType } from "../../types/user";
import { generateEmployee, generateClient } from "../helpers";

const employeesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		changeEmployeePassword: build.mutation<
			{ detail: string },
			ChangePasswordType
		>({
			query: ({ email, password1, password2, type }) => ({
				url: EMPLOYEE_PASSWORD_CHANGE_URL,
				method: "POST",
				body: {
					email,
					new_password1: password1,
					new_password2: password2,
					type,
				},
				credentials: "include",
			}),
		}),
		createClient: build.mutation<ClientType, ClientCreateType>({
			query: (data) => ({
				url: CLIENTS_URL,
				method: "POST",
				headers: {
					"default-content-type": "use-browser-default",
				},
				credentials: "include",
				body: generateClient(data),
			}),
			invalidatesTags: (result) =>
				result ? [{ type: "Client", id: "CLIENT_LIST" }] : [],
		}),
		createEmployee: build.mutation<EmployeeType, FormType>({
			query: (employee) => ({
				url: EMPLOYEES_URL,
				method: "POST",
				headers: {
					"default-content-type": "use-browser-default",
				},
				credentials: "include",
				body: generateEmployee(employee),
			}),
			invalidatesTags: (result) =>
				result ? [{ type: "Employee", id: "EMPLOYEE_LIST" }] : [],
		}),
		createHoliday: build.mutation<HolidayType, HolidayCreateType>({
			query: (data) => ({
				url: HOLIDAYS_URL,
				method: "POST",
				body: data,
				credentials: "include",
			}),
			invalidatesTags: (result) =>
				result ? [{ type: "Holiday", id: "HOLIDAY_LIST" }] : [],
		}),
		deactivateEmployee: build.mutation<
			{ detail: string; type: "client" | "employee"; id: string },
			{
				email: string;
				action: "activate" | "deactivate";
				type?: "client" | "employee";
			}
		>({
			query: ({ email, action, type }) => ({
				url: EMPLOYEE_DEACTIVATE_URL,
				method: "POST",
				body: { email, action, type },
				credentials: "include",
			}),
			invalidatesTags: (result) =>
				result
					? result.type === "client"
						? [{ type: "Client", id: result.id }]
						: [{ type: "Employee", id: result.id }]
					: [],
		}),
		deleteClient: build.mutation<unknown, string>({
			query: (id) => ({
				url: CLIENT_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Client", id }] : [],
		}),
		deleteEmployee: build.mutation<unknown, string>({
			query: (id) => ({
				url: EMPLOYEE_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Employee", id }] : [],
		}),
		deleteHoliday: build.mutation<HolidayType, string>({
			query: (id) => ({
				url: HOLIDAY_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Holiday", id }] : [],
		}),
		getAttendance: build.query<AttendanceListType, PaginationType>({
			query: ({ limit, offset }) => ({
				url: `${ATTENDANCE_URL}?limit=${limit}&offset=${offset}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: ["Attendance"],
		}),
		getAttendanceInfo: build.query<AttendanceInfoType, void>({
			query: () => ({
				url: ATTENDANCE_INFO_URL,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: ["Attendance"]
		}),
		getClient: build.query<ClientType, string>({
			query: (id) => ({
				url: CLIENT_URL(id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, id) =>
				result ? [{ type: "Client" as const, id }] : [],
		}),
		getClients: build.query<ClientListType, ClientPaginationType>({
			query: ({ limit, offset, search, active }) => ({
				url: `${CLIENTS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}&active=${active !== undefined ? active : ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Client" as const, id })),
							{ type: "Client" as const, id: "CLIENT_LIST" },
					  ]
					: [{ type: "Client", id: "CLIENT_LIST" }],
		}),
		getEmployee: build.query<EmployeeType, string>({
			query: (id) => ({
				url: EMPLOYEE_URL(id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, id) =>
				result ? [{ type: "Employee" as const, id }] : [],
		}),
		getEmployees: build.query<GetEmployeesDataType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${EMPLOYEES_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Employee" as const, id })),
							{ type: "Employee" as const, id: "EMPLOYEE_LIST" },
					  ]
					: [{ type: "Employee" as const, id: "EMPLOYEE_LIST" }],
		}),
		getHolidays: build.query<HolidayListType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${HOLIDAYS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Holiday" as const, id })),
							{ type: "Holiday" as const, id: "HOLIDAY_LIST" },
					  ]
					: [{ type: "Holiday" as const, id: "HOLIDAY_LIST" }],
		}),
		punchAction: build.mutation<{ detail: string }, "in" | "out">({
			query: (action) => ({
				url: ATTENDANCE_URL,
				method: "POST",
				body: { action },
				credentials: "include",
			}),
			invalidatesTags: (result) =>
				result ? ["Attendance"] : [],
		}),
		updateClient: build.mutation<
			ClientType,
			{ id: string; data: ClientCreateType }
		>({
			query: ({ id, data }) => ({
				url: CLIENT_URL(id),
				method: "PUT",
				headers: {
					"default-content-type": "use-browser-default",
				},
				body: generateClient(data),
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Client", id: args.id }] : [],
		}),
		updateEmployee: build.mutation<
			EmployeeType,
			{ employee: FormType; id: string }
		>({
			query: ({ employee, id }) => ({
				url: EMPLOYEE_URL(id),
				method: "PUT",
				headers: {
					"default-content-type": "use-browser-default",
				},
				credentials: "include",
				body: generateEmployee(employee),
			}),
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Employee", id: args.id }] : [],
		}),
		updateHoliday: build.mutation<
			HolidayType,
			{ id: string; data: HolidayCreateType }
		>({
			query: ({ id, data }) => ({
				url: HOLIDAY_URL(id),
				method: "PUT",
				body: data,
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Holiday", id: args.id }] : [],
		}),
	}),
	overrideExisting: false,
});

export const {
	useChangeEmployeePasswordMutation,
	useCreateClientMutation,
	useCreateEmployeeMutation,
	useCreateHolidayMutation,
	useDeactivateEmployeeMutation,
	useDeleteClientMutation,
	useDeleteEmployeeMutation,
	useDeleteHolidayMutation,
	useGetAttendanceQuery,
	useGetAttendanceInfoQuery,
	useGetClientQuery,
	useGetClientsQuery,
	useGetEmployeeQuery,
	useGetEmployeesQuery,
	useGetHolidaysQuery,
	usePunchActionMutation,
	useUpdateClientMutation,
	useUpdateEmployeeMutation,
	useUpdateHolidayMutation,
} = employeesApi;
