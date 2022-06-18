import { baseApi } from "./base";
import { DATA_LIFETIME, JOBS_URL, JOB_URL } from "../../config";
import { PaginationType } from "../../types/common";
import { GetJobsDataType } from "../../types/jobs";

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
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Job" as const, id })),
							{ type: "Job" as const, id: "JOB_LIST" },
					  ]
					: [],
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
			invalidatesTags: (result) =>
				result ? [{ type: "Job", id: "JOB_LIST" }] : [],
		}),
		updateJob: build.mutation<
			{ success: string },
			{ id: string; name: string }
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
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Job", id: args.id }] : [],
		}),
		deleteJob: build.mutation<{ success: string }, string>({
			query: (id) => ({
				url: JOB_URL(id),
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Job", id }] : [],
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
