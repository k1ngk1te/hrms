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
	TASK_URL,
} from "../../config";
import {
	DataListType,
	ProjectListType,
	PaginationType,
	ProjectType,
	ProjectCreateType,
	ProjectFileCreateType,
	ProjectFileType,
	UserEmployeeType,
	TaskCreateType,
	TaskListType,
	TaskType,
} from "../../types";

export interface TaskPaginationType extends PaginationType {
	project_id: string;
}

export interface ProjectEmployeesListType extends DataListType {
	results: UserEmployeeType[]
}

const generateProjectFile = (data: ProjectFileCreateType) => {
	const form = new FormData();
	form.append("name", data.name);
	form.append("file", data.file);
	return form;
};

const projectsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createProject: build.mutation<ProjectType, ProjectCreateType>({
			query: (data) => ({
				url: PROJECTS_URL,
				method: "POST",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result) =>
				result ? [{ type: "Project", id: "PROJECT_LIST" }] : [],
		}),
		createProjectFile: build.mutation<
			ProjectFileType,
			{ project_id: string; data: ProjectFileCreateType }
		>({
			query: ({ project_id, data }) => ({
				url: PROJECT_FILES_URL(project_id),
				method: "POST",
				credentials: "include",
				headers: {
					"default-content-type": "use-browser-default",
				},
				body: generateProjectFile(data),
			}),
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Project", id: args.project_id }] : [],
		}),
		createTask: build.mutation<
			TaskType,
			{ project_id: string; data: TaskCreateType }
		>({
			query: ({ project_id, data }) => ({
				url: TASKS_URL(project_id),
				method: "POST",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result, error, args) =>
				result
					? [
							{ type: "Task", id: "TASK_LIST" },
							{ type: "Project", id: args.project_id },
					  ]
					: [],
		}),
		deleteProject: build.mutation<unknown, string>({
			query: (id) => ({
				url: PROJECT_URL(id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, id) =>
				!error ? [{ type: "Project", id }] : [],
		}),
		deleteProjectFile: build.mutation<
			unknown,
			{ project_id: string; id: number }
		>({
			query: ({ project_id, id }) => ({
				url: PROJECT_FILE_URL(project_id, id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) =>
				!error ? [{ type: "Project", id: args.project_id }] : [],
		}),
		deleteTask: build.mutation<unknown, { project_id: string; id: string }>({
			query: ({ project_id, id }) => ({
				url: TASK_URL(project_id, id),
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: (result, error, args) =>
				!error
					? [
							{ type: "Task", id: args.id },
							{ type: "Project", id: args.project_id },
					  ]
					: [],
		}),
		getProject: build.query<ProjectType, string>({
			query: (id) => ({
				url: PROJECT_URL(id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, id) =>
				result ? [{ type: "Project" as const, id }] : [],
		}),
		getProjectEmployees: build.query<
			ProjectEmployeesListType,
			TaskPaginationType
		>({
			query: ({ project_id, limit, offset, search }) => ({
				url: `${PROJECT_EMPLOYEES_URL(project_id)}?offset=${
					search ? 0 : offset
				}&limit=${search ? 0 : limit}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: [{type: "Task" as const, id: "TASK_LIST"}, {type: "Project" as const,id: "PROJECT_LIST"}],
		}),
		getProjects: build.query<ProjectListType, PaginationType>({
			query: ({ limit, offset, search }) => ({
				url: `${PROJECTS_URL}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Project" as const, id })),
							{ type: "Project" as const, id: "PROJECT_LIST" },
					  ]
					: [{ type: "Project" as const, id: "PROJECT_LIST" }],
		}),
		getTask: build.query<TaskType, { project_id: string; id: string }>({
			query: ({ id, project_id }) => ({
				url: TASK_URL(project_id, id),
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (result, error, args) =>
				result ? [{ type: "Task" as const, id: args.id }] : [],
		}),
		getTasks: build.query<TaskListType, TaskPaginationType>({
			query: ({ project_id, limit, offset, search }) => ({
				url: `${TASKS_URL(project_id)}?offset=${search ? 0 : offset}&limit=${
					search ? 0 : limit
				}&search=${search || ""}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: DATA_LIFETIME,
			providesTags: (data) =>
				data
					? [
							...data.results.map(({ id }) => ({ type: "Task" as const, id })),
							{ type: "Task" as const, id: "TASK_LIST" },
					  ]
					: [{ type: "Task" as const, id: "TASK_LIST" }],
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
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Project", id: args.id }] : [],
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
			invalidatesTags: (result, error, args) =>
				result ? [{ type: "Project", id: args.id }] : [],
		}),
		updateTask: build.mutation<
			TaskType,
			{ id: string; project_id: string; data: TaskCreateType }
		>({
			query: ({ id, project_id, data }) => ({
				url: TASK_URL(project_id, id),
				method: "PUT",
				credentials: "include",
				body: data,
			}),
			invalidatesTags: (result, error, args) =>
				result
					? [
							{ type: "Task", id: args.id },
							{ type: "Project", id: args.project_id },
					  ]
					: [],
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
