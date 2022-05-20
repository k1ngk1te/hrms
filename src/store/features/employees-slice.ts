import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	CLIENT_URL,
	CLIENTS_URL,
	EMPLOYEE_URL,
	EMPLOYEES_URL,
	EMPLOYEE_DEACTIVATE_URL,
	EMPLOYEE_PASSWORD_CHANGE_URL,
} from "@/config";
import { PaginationType } from "@/types/common";
import {
	GetEmployeesDataType,
	ClientType,
	ClientCreateType,
	ClientListType,
	EmployeeType,
	FormType,
} from "@/types/employees";
import { ChangePasswordType } from "@/types/user";
import { generateEmployee, generateClient } from "../helpers";

const employeesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createClient: build.mutation<ClientType, ClientCreateType>({
			query: (data) => ({
				url: CLIENTS_URL,
				method: "POST",
				headers: {
					"default-content-type": "use-browser-default",
				},
				credentials: "include",
				body: generateClient(data)
			}),
			invalidatesTags: (result) => result ? ["Client"] : []
		}),
		getClient: build.query<ClientType, number | string>({
			query: (id) => ({
				url: CLIENT_URL(id),
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Client"]
		}),
		updateClient: build.mutation<ClientType, { id: number | string; data: ClientCreateType }>({
			query: ({ id, data }) => ({
				url: CLIENT_URL(id),
				method: "PUT",
				headers: {
					"default-content-type": "use-browser-default",
				},
				body: generateClient(data),
				credentials: "include",
			}),
			invalidatesTags: ["Client"]
		}),
		getClients: build.query<ClientListType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${CLIENTS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Client"]
		}),
		getEmployees: build.query<GetEmployeesDataType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${EMPLOYEES_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Employee"],
		}),
		getEmployee: build.query<EmployeeType, number | string>({
			query: (id) => ({
				url: EMPLOYEE_URL(id),
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Employee"],
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
			invalidatesTags: (result) => (result ? ["Employee"] : []),
		}),
		updateEmployee: build.mutation<
			EmployeeType,
			{ employee: FormType; id: number | string }
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
			invalidatesTags: (result) => (result ? ["Employee"] : []),
		}),
		changeEmployeePassword: build.mutation<
			{ detail: string },
			ChangePasswordType
		>({
			query: ({ email, password1, password2, type }) => ({
				url: EMPLOYEE_PASSWORD_CHANGE_URL,
				method: "POST",
				body: { email, new_password1: password1, new_password2: password2, type },
				credentials: "include",
			}),
		}),
		deactivateEmployee: build.mutation<
			{ detail: string; type: "client" | "employee" },
			{ email: string; action: "activate" | "deactivate", type?: "client" | "employee" }
		>({
			query: ({ email, action, type }) => ({
				url: EMPLOYEE_DEACTIVATE_URL,
				method: "POST",
				body: { email, action, type },
				credentials: "include",
			}),
			invalidatesTags: (result) => (result ? result.type === "client" ? ["Client"] : ["Employee"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useChangeEmployeePasswordMutation,
	useCreateClientMutation,
	useCreateEmployeeMutation,
	useDeactivateEmployeeMutation,
	useGetClientQuery,
	useGetClientsQuery,
	useGetEmployeeQuery,
	useGetEmployeesQuery,
	useUpdateClientMutation,
	useUpdateEmployeeMutation,
} = employeesApi;
