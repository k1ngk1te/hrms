import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	LEAVES_URL,
	LEAVE_DETAIL_URL,
	LEAVES_ADMIN_URL,
	LEAVE_ADMIN_DETAIL_URL,
	OVERTIME_URL,
	OVERTIME_DETAIL_URL,
	OVERTIME_ADMIN_URL,
	OVERTIME_ADMIN_DETAIL_URL,
} from "../../config";
import { PaginationType } from "../../types/common";
import {
	GetLeavesDataType,
	FormType,
	LeaveType,
	OvertimeType,
	OvertimeListType,
	OvertimeCreateType,
} from "../../types/leaves";

interface QueryType extends PaginationType {
	from: string;
	to: string;
}

const leavesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		approveLeave: build.mutation<
			string,
			{ id: string | number; approval: "approved" | "denied" }
		>({
			query: ({ id, approval }) => ({
				url: LEAVE_ADMIN_DETAIL_URL(id),
				method: "PATCH",
				body: { approval },
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error, args) =>
				result
					? [
							{ type: "Employee", id: "EMPLOYEE_LIST" },
							{ type: "Leave", id: args.id },
							{ type: "LeaveAdmin", id: args.id },
					  ]
					: [],
		}),
		approveOvertime: build.mutation<
			string,
			{ id: string; approval: "approved" | "denied" }
		>({
			query: ({ id, approval }) => ({
				url: OVERTIME_ADMIN_DETAIL_URL(id),
				method: "PATCH",
				body: { approval },
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error, args) =>
				result
					? [
							{ type: "Overtime", id: args.id },
							{ type: "OvertimeAdmin", id: args.id },
					  ]
					: [],
		}),
		createLeave: build.mutation<LeaveType, FormType>({
			query: (data) => ({
				url: LEAVES_ADMIN_URL,
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: "Employee", id: "EMPLOYEE_LIST" },
							{ type: "Leave", id: result.id },
							{ type: "LeaveAdmin", id: result.id },
							{ type: "LeaveAdmin", id: "LEAVE_ADMIN_LIST" },
					  ]
					: [],
		}),
		createOvertime: build.mutation<OvertimeType, OvertimeCreateType>({
			query: (data) => ({
				url: OVERTIME_ADMIN_URL,
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: "Overtime", id: result.id },
							{ type: "OvertimeAdmin", id: result.id },
							{ type: "OvertimeAdmin", id: "OVERTIME_ADMIN_LIST" },
					  ]
					: [],
		}),
		getAdminLeaves: build.query<GetLeavesDataType, QueryType>({
			query: ({ from, limit, search, offset, to }) => ({
				url: `${LEAVES_ADMIN_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}&from=${from}&to=${to}`,
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
							...data.results.map(({ id }) => ({ type: "LeaveAdmin", id })),
							{ type: "LeaveAdmin", id: "LEAVE_ADMIN_LIST" },
					  ]
					: [{ type: "LeaveAdmin", id: "LEAVE_ADMIN_LIST" }],
		}),
		getAdminOvertime: build.query<OvertimeListType, QueryType>({
			query: ({ from, limit, search, offset, to }) => ({
				url: `${OVERTIME_ADMIN_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}&from=${from}&to=${to}`,
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
							...data.results.map(({ id }) => ({ type: "OvertimeAdmin", id })),
							{ type: "OvertimeAdmin", id: "OVERTIME_ADMIN_LIST" },
					  ]
					: [{ type: "OvertimeAdmin", id: "OVERTIME_ADMIN_LIST" }],
		}),
		getLeave: build.query<LeaveType, string>({
			query: (id) => ({
				url: LEAVE_DETAIL_URL(id),
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, id) =>
				result ? [{ type: "Leave", id }] : [],
		}),
		getLeaves: build.query<GetLeavesDataType, QueryType>({
			query: ({ from, limit, offset, to }) => ({
				url: `${LEAVES_URL}?offset=${offset}&limit=${limit}&from=${from}&to=${to}`,
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
							...data.results.map(({ id }) => ({ type: "Leave", id })),
							{ type: "Leave", id: "LEAVE_LIST" },
					  ]
					: [{ type: "Leave", id: "LEAVE_LIST" }],
		}),
		getOvertime: build.query<OvertimeListType, QueryType>({
			query: ({ from, limit, offset, to }) => ({
				url: `${OVERTIME_URL}?offset=${offset}&limit=${limit}&from=${from}&to=${to}`,
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
							...data.results.map(({ id }) => ({ type: "Overtime", id })),
							{ type: "Overtime", id: "OVERTIME_LIST" },
					  ]
					: [{ type: "Overtime", id: "OVERTIME_LIST" }],
		}),
		getOvertimeData: build.query<LeaveType, string>({
			query: (id) => ({
				url: OVERTIME_DETAIL_URL(id),
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, id) =>
				result ? [{ type: "Overtime", id }] : [],
		}),
		requestLeave: build.mutation<LeaveType, FormType>({
			query: (data) => ({
				url: LEAVES_URL,
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: "Leave", id: result.id },
							{ type: "Leave", id: "LEAVE_LIST" },
					  ]
					: [],
		}),
		requestOvertime: build.mutation<OvertimeType, OvertimeCreateType>({
			query: (data) => ({
				url: OVERTIME_URL,
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) =>
				result
					? [
							{ type: "Overtime", id: result.id },
							{ type: "Overtime", id: "OVERTIME_LIST" },
					  ]
					: [],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetLeaveQuery,
	useGetLeavesQuery,
	useGetAdminLeavesQuery,
	useCreateLeaveMutation,
	useRequestLeaveMutation,
	useApproveLeaveMutation,

	useGetOvertimeDataQuery,
	useGetOvertimeQuery,
	useGetAdminOvertimeQuery,
	useCreateOvertimeMutation,
	useRequestOvertimeMutation,
	useApproveOvertimeMutation,
} = leavesApi;
