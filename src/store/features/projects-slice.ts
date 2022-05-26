import { baseApi } from "./base";
import { DATA_LIFETIME, PROJECTS_URL, PROJECT_URL } from "@/config";
import { ProjectListType, PaginationType, ProjectType, ProjectCreateType } from "@/types";

const projectsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProjects: build.query<ProjectListType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${PROJECTS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Project"],
		}),
		getProject: build.query<ProjectType, number |string>({
			query: (id) => ({
				url: PROJECT_URL(id),
				method: "GET",
				credentials: "include"
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Project"],
		}),
		createProject: build.mutation<ProjectType, ProjectCreateType>({
			query: (data) => ({
				url: PROJECTS_URL,
				method: "POST",
				credentials: "include"
			}),
			invalidatesTags: ["Project"]
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProjectsQuery,
	useGetProjectQuery,
	useCreateProjectMutation
} = projectsApi;
