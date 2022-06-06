import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEye, FaPen } from "react-icons/fa";
import { PROJECT_TASKS_PAGE_URL, PROJECT_TEAM_PAGE_URL } from "../../../config";
import { isErrorWithData, isFormError } from "../../../store";
import { open as modalOpen, close as modalClose } from "../../../store/features/modal-slice";
import { useGetProjectQuery } from "../../../store/features/projects-slice";
import { useAppDispatch, useAppSelector, useUpdateProject } from "../../../hooks";
import {
	Form,
	ProjectDetail,
	ProjectFiles,
	ProjectImages,
	Task,
} from "../../../components/Projects";
import { Container, Modal, TabNavigator } from "../../../components/common";
import { Button } from "../../../components/controls";
import { ProjectCreateType, ProjectCreateErrorType } from "../../../types/employees";
import { createProject } from "../../../utils/projects";

const Tasks = () => (
	<ul>
		<Task title="Patient appointment booking" completed={false} />
		<Task title="Patient appointment booking" completed={false} />
		<Task title="Patient appointment booking" completed={false} />
		<Task title="Patient appointment booking" completed />
		<Task title="Patient appointment booking" completed={false} />
		<Task title="Patient appointment booking" completed />
	</ul>
);

const Detail = () => {
	const { id } = useParams();
	const { data, error, refetch, isLoading, isFetching } = useGetProjectQuery(
		id || "",
		{
			skip: id === undefined,
		}
	);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const updateProject = useUpdateProject();

	const screens = [
		{ title: "all tasks", component: <Tasks /> },
		{ title: "pending tasks", component: <Tasks /> },
		{ title: "completed tasks", component: <Tasks /> },
	];

	useEffect(() => {
		if (updateProject.success) {
			dispatch(modalClose());
		}
	}, [dispatch, updateProject.success]);

	return (
		<Container
			background="bg-gray-100 overflow-y-hidden"
			heading="Project Information"
			loading={isLoading}
			refresh={{
				onClick: refetch,
				loading: isFetching,
			}}
			icon
			error={
				isErrorWithData(error)
					? {
							statusCode: error?.status || 500,
							title: String(error.data?.detail || error.data?.error || ""),
					  }
					: undefined
			}
			title={data ? data.name : ""}
		>
			{data && (
				<div className="p-2">
					<div className="flex flex-wrap items-center w-full sm:px-4 lg:justify-end">
						<div className="my-2 w-full sm:px-2 sm:w-1/3 md:w-1/4 lg:w-1/5">
							<Button
								IconLeft={FaEye}
								rounded="rounded-xl"
								disabled={updateProject.isLoading}
								title="manage tasks"
								link={PROJECT_TASKS_PAGE_URL(id || "")}
							/>
						</div>
						<div className="my-2 w-full sm:px-2 sm:w-1/3 md:w-1/4 lg:w-1/5">
							<Button
								IconLeft={FaEye}
								rounded="rounded-xl"
								disabled={updateProject.isLoading}
								title="manage team"
								link={PROJECT_TEAM_PAGE_URL(id || "")}
							/>
						</div>
						<div className="my-2 w-full sm:px-2 sm:w-1/3 md:w-1/4 lg:w-1/5">
							<Button
								IconLeft={FaPen}
								onClick={() => dispatch(modalOpen())}
								rounded="rounded-xl"
								disabled={updateProject.isLoading}
								title="edit project"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center lg:flex-row lg:items-start">
						<div className="py-2 w-full sm:px-4 lg:w-2/3">
							<div className="bg-white p-4 rounded-md shadow-lg">
								<div className="my-2">
									<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
										{data.name}
									</h3>
								</div>
								<div className="my-1">
									<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
										1{" "}
										<span className="font-bold text-gray-600">open tasks</span>,
									</span>
									<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
										9{" "}
										<span className="font-bold text-gray-600">
											tasks completed
										</span>
									</span>
								</div>
								<div className="my-1">
									<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
										{data.description}
									</p>
								</div>
							</div>

							<ProjectImages />

							<ProjectFiles />

							<div className="bg-white my-4 p-4 rounded-md shadow-lg">
								<TabNavigator container="" screens={screens} />
							</div>
						</div>

						<ProjectDetail 
							changePriority={(priority: string) => {
								if (priority !== data.priority) {
									const project = { ...createProject(data), priority }
									updateProject.onSubmit(id, project)
								}
							}}
							leaders={data.leaders || []}
							team={data.team || []}
							loading={updateProject.isLoading} 
							priority={data.priority || "L"}
						/>
					</div>
					<Modal
						close={() => dispatch(modalClose())}
						component={
							<Form
								initState={{
									...createProject(data), 
									leaders: data.leaders.map(leader => leader.id),
									team: data.team.map(member => member.id)
								}}
								editMode
								errors={
									updateProject.error &&
									isFormError<ProjectCreateErrorType>(updateProject.error)
										? updateProject.error.data
										: undefined
								}
								loading={updateProject.isLoading}
								onSubmit={(form: ProjectCreateType) =>
									updateProject.onSubmit(data.id, form)
								}
							/>
						}
						keepVisible
						description="Fill in the form below to edit this project"
						title="Edit Project"
						visible={modalVisible}
					/>
				</div>
			)}
		</Container>
	);
};

export default Detail;
