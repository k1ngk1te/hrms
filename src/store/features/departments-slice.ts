import { baseApi } from "./base";
import { DATA_LIFETIME, DEPARTMENTS_URL, DEPARTMENT_URL } from "../../config";
import { PaginationType } from "../../types/common";
import { GetDepartmentsDataType } from "../../types/departments";

const departmentsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getDepartments: build.query<GetDepartmentsDataType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${DEPARTMENTS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Department"],
		}),
		createDepartment: build.mutation<
			{ success: string },
			{ name: string; hod?: string }
		>({
			query: (data) => ({
				url: DEPARTMENTS_URL,
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) => (result ? ["Department"] : []),
		}),
		updateDepartment: build.mutation<
			{ success: string },
			{ id: number | string; hod?: string; name: string }
		>({
			query: ({ id, hod, name }) => ({
				url: DEPARTMENT_URL(id),
				method: "PUT",
				body: {
					id,
					hod: hod ? parseInt(hod) : "",
					name,
				},
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) => (result ? ["Department"] : []),
		}),
		deleteDepartment: build.mutation<{ success: string }, number | string>({
			query: (id) => ({
				url: DEPARTMENT_URL(id),
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error) => (!error ? ["Department"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetDepartmentsQuery,
	useCreateDepartmentMutation,
	useUpdateDepartmentMutation,
	useDeleteDepartmentMutation,
} = departmentsApi;
