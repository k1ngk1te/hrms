import { baseApi } from "./base";
import { DATA_LIFETIME, DEPARTMENTS_URL, DEPARTMENT_URL } from "../../config";
import { PaginationType } from "../../types/common";
import { GetDepartmentsDataType, DepartmentCreateType } from "../../types/departments";

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
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Department" as const, id })),
							{ type: "Department" as const, id: "DEPARTMENT_LIST" },
					  ]
					: [],
		}),
		createDepartment: build.mutation<
			{ success: string },
			DepartmentCreateType
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
			invalidatesTags: (result) =>
				result ? [{ type: "Department", id: "DEPARTMENT_LIST" }] : [],
		}),
		updateDepartment: build.mutation<
			{ success: string },
			{ id: string; data: DepartmentCreateType }
		>({
			query: ({ id, data }) => ({
				url: DEPARTMENT_URL(id),
				method: "PUT",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Department", id: args.id }] : [],
		}),
		deleteDepartment: build.mutation<{ success: string }, string>({
			query: (id) => ({
				url: DEPARTMENT_URL(id),
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Department", id }] : [],
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
