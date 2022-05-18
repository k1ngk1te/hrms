import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	LEAVES_URL,
	LEAVE_DETAIL_URL,
	LEAVES_ADMIN_URL,
	LEAVE_ADMIN_DETAIL_URL,
} from "@/config";
import { PaginationType } from "@/types/common";
import { GetLeavesDataType, FormType, LeaveType } from "@/types/leaves";

interface QueryType extends PaginationType {
	name?: string;
	from: string;
	to: string;
}

const leavesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getLeaves: build.query<GetLeavesDataType, QueryType>({
			query: ({ from, limit, offset, to }) => ({
				url: `${LEAVES_URL}?offset=${offset}&limit=${limit}&from=${from}&to=${to}`,
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Leave"],
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
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Leave"],
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
			invalidatesTags: (result) => (result ? ["Employee", "Leave"] : []),
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
			invalidatesTags: (result) => (result ? ["Leave"] : []),
		}),
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
			invalidatesTags: (result) => (result ? ["Employee", "Leave"] : []),
		}),
		getLeave: build.query<LeaveType, string | number>({
			query: (id) => ({
				url: LEAVE_DETAIL_URL(id),
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			providesTags: ["Leave"],
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
} = leavesApi;
