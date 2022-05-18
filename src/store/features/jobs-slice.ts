import { baseApi } from "./base";
import { DATA_LIFETIME, JOBS_URL, JOB_URL } from "@/config";
import { PaginationType } from "@/types/common";
import { GetJobsDataType } from "@/types/jobs";

const jobsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getJobs: build.query<GetJobsDataType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${JOBS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Job"],
		}),
		createJob: build.mutation<{ success: string }, { name: string }>({
			query: ({ name }) => ({
				url: JOBS_URL,
				method: "POST",
				body: { name },
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) => (result ? ["Job"] : []),
		}),
		updateJob: build.mutation<
			{ success: string },
			{ id: number | string; name: string }
		>({
			query: ({ id, name }) => ({
				url: JOB_URL(id),
				method: "PUT",
				body: { name },
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result) => (result ? ["Job"] : []),
		}),
		deleteJob: build.mutation<{ success: string }, number | string>({
			query: (id) => ({
				url: JOB_URL(id),
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error) => (!error ? ["Job"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetJobsQuery,
	useCreateJobMutation,
	useDeleteJobMutation,
	useUpdateJobMutation,
} = jobsApi;
