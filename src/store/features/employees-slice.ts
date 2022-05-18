import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	EMPLOYEE_URL,
	EMPLOYEES_URL,
	EMPLOYEE_DEACTIVATE_URL,
	EMPLOYEE_PASSWORD_CHANGE_URL,
} from "@/config";
import { PaginationType } from "@/types/common";
import {
	GetEmployeesDataType,
	EmployeeType,
	FormType,
} from "@/types/employees";
import { ChangePasswordType } from "@/types/user";

const generateEmployee = (data: FormType) => {
	const form = new FormData();

	form.append("user.email", data.email);
	form.append("user.first_name", data.first_name);
	form.append("user.last_name", data.last_name);
	data.image && form.append("profile.image", data.image);
	form.append("profile.gender", data.gender);
	form.append("profile.phone", data.phone);
	form.append("profile.address", data.address);
	form.append("profile.state", data.state);
	form.append("profile.city", data.city);
	form.append("profile.date_of_birth", data.date_of_birth);
	form.append("job.id", data.job);
	form.append("supervisor", data.supervisor);
	form.append("department.id", data.department);
	form.append("date_employed", data.date_employed);

	return form;
};

const employeesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
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
			{ success: string },
			ChangePasswordType
		>({
			query: ({ email, password1, password2 }) => ({
				url: EMPLOYEE_PASSWORD_CHANGE_URL,
				method: "POST",
				body: { email, new_password1: password1, new_password2: password2 },
				credentials: "include",
			}),
		}),
		deactivateEmployee: build.mutation<
			{ success: string },
			{ email: string; action: "activate" | "deactivate" }
		>({
			query: ({ email, action }) => ({
				url: EMPLOYEE_DEACTIVATE_URL,
				method: "POST",
				body: { email, action },
				credentials: "include",
			}),
			invalidatesTags: (result) => (result ? ["Employee"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetEmployeeQuery,
	useGetEmployeesQuery,
	useCreateEmployeeMutation,
	useUpdateEmployeeMutation,
	useChangeEmployeePasswordMutation,
	useDeactivateEmployeeMutation,
} = employeesApi;
