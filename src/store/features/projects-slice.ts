import { baseApi } from "./base";
import {
	DATA_LIFETIME,
	PROJECTS_URL,
	PROJECT_URL,
	PROJECT_COMPLETED_URL,
	PROJECT_EMPLOYEES_URL,
	PROJECT_FILE_URL,
	PROJECT_FILES_URL,
	TASKS_URL,
	TASK_URL
} from "../../config";
import {
	ProjectListType,
	PaginationType,
	ProjectType,
	ProjectCreateType,
	ProjectFileCreateType,
	ProjectFileType,
	TaskCreateType,
	TaskListType,
	TaskType
} from "../../types";

export interface TaskPaginationType extends PaginationType {
	project_id: string;
}

const generateProjectFile = (data: ProjectFileCreateType) => {
	const form = new FormData()
	form.append("name") = data.name
	form.append("file") = data.file
	return form;
}

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
		getProjectEmployees: build.query<ProjectEmployeesListType, TaskPaginationType>({
			query: ({ project_id, limit, offset, search }) => ({
				url: `${PROJECT_EMPLOYEES_URL(project_id)}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Task", "Project"],
		}),
		getTasks: build.query<TaskListType, TaskPaginationType>({
			query: ({ project_id, limit, offset, search }) => ({
				url: `${TASKS_URL(project_id)}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Task"],
		}),
		getProject: build.query<ProjectType, string>({
			query: (id) => ({
				url: PROJECT_URL(id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Project"],
		}),
		getTask: build.query<TaskType, {project_id: string; id: string;}>({
			query: ({ id, project_id }) => ({
				url: TASK_URL(project_id, id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME || 60,
			providesTags: ["Task"],
		}),
		createProject: build.mutation<ProjectType, ProjectCreateType>({
			query: (data) => ({
				url: PROJECTS_URL,
				method: "POST",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result) => (result ? ["Project"] : []),
		}),
		createTask: build.mutation<
			TaskType,
			{project_id: string; data: TaskCreateType}
		>({
			query: ({ project_id, data }) => ({
				url: TASKS_URL(project_id),
				method: "POST",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result) => (result ? ["Task"] : []),
		}),
		createProjectFile: build.mutation<
			ProjectFileType,
			{project_id: string; data: ProjectFileCreateType}
		>({
			query: ({ project_id, data }) => ({
				url: PROJECT_FILES_URL(project_id),
				method: "POST",
				credentials: "include",
				body: generateProjectFile(data),
			}),
			invalidatesTags: (result) => (result ? ["Project"] : []),
		}),
		updateProject: build.mutation<
			ProjectType,
			{ id: string; data: ProjectCreateType }
		>({
			query: ({ id, data }) => ({
				url: PROJECT_URL(id),
				method: "PUT",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result) => (result ? ["Project"] : []),
		}),
		updateTask: build.mutation<
			TaskType,
			{id: string; project_id: string; data: TaskCreateType}
		>({
			query: ({ id, project_id, data }) => ({
				url: TASK_URL(project_id, id),
				method: "PUT",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result) => (result ? ["Task"] : []),
		}),
		deleteProject: build.mutation<unknown, string>({
			query: (id) => ({
				url: PROJECT_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error) => (!error ? ["Project"] : []),
		}),
		deleteTask: build.mutation<unknown, {project_id: string; id: string;}>({
			query: ({project_id, id}) => ({
				url: TASK_URL(project_id, id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error) => (!error ? ["Task", "Project"] : []),
		}),
		deleteProjectFile: build.mutation<unknown, {project_id: string; id: number}>({
			query: ({ project_id, id }) => ({
				url: PROJECT_FILE_URL(project_id, id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error) => (!error ? ["Project"] : []),
		}),
		markProjectCompleted: build.mutation<
			{ detail: string },
			{ id: string; action: boolean }
		>({
			query: ({ id, action }) => ({
				url: PROJECT_COMPLETED_URL(id),
				method: "POST",
				body: { action },
				credentials: "include",
			}),
			invalidatesTags: (result) => (result ? ["Project"] : []),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProjectsQuery,
	useGetProjectQuery,
	useGetProjectEmployeesQuery,
	useGetTasksQuery,
	useGetTaskQuery,
	useCreateProjectMutation,
	useCreateProjectFileMutation,
	useCreateTaskMutation,
	useUpdateProjectMutation,
	useUpdateTaskMutation,
	useDeleteProjectMutation,
	useDeleteProjectFileMutation,
	useDeleteTaskMutation,
	useMarkProjectCompletedMutation,
} = projectsApi;
