import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { isErrorWithData, isFormError } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	open as modalOpen,
	close as modalClose,
} from "../../store/features/modal-slice";
import {
	useGetProjectsQuery,
	useCreateProjectMutation,
} from "../../store/features/projects-slice";
import { useAppDispatch, useAppSelector, useUpdateProject } from "../../hooks";
import { Container, Modal } from "../../components/common";
import { Cards, Form, Project, Topbar } from "../../components/Projects";
import {
	ProjectType,
	ProjectCreateType,
	ProjectCreateErrorType,
} from "../../types/employees";
import { InitStateType } from "../../components/Projects/Form";

const Projects = () => {
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	const [editId, setEditId] = useState<string | undefined>(undefined)
	const [editMode, setEditMode] = useState(false);
	const [initState, setInitState] = useState<InitStateType | undefined>(
		undefined
	);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const { data, error, refetch, isLoading, isFetching } = useGetProjectsQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search,
	});
	const [createProject, createData] = useCreateProjectMutation();
	const updateProject = useUpdateProject();

	const handleSubmit = useCallback(
		(form: ProjectCreateType) => {
			createProject(form);
		},
		[createProject]
	);

	useEffect(() => {
		if (createData.status === "fulfilled") {
			dispatch(
				alertModalOpen({
					color: "success",
					header: "Project Created",
					message: "Project was created successfully",
				})
			);
			dispatch(modalClose());
		}
	}, [dispatch, createData.status]);

	useEffect(() => {
		if (editMode && updateProject.success) {
			dispatch(modalClose());
			setInitState(undefined);
			setEditMode(false);
			setEditId(undefined);
			updateProject.reset()
		}
	}, [dispatch, updateProject.success, updateProject.reset, editMode]);

	return (
		<Container
			background="bg-gray-100"
			heading="Projects"
			loading={isLoading}
			disabledLoading={!isLoading && isFetching}
			refresh={{
				onClick: refetch,
				loading: isFetching,
			}}
			error={
				isErrorWithData(error)
					? {
							statusCode: error?.status || 500,
							title: String(error.data?.detail || error.data?.error || ""),
					  }
					: undefined
			}
			paginate={
				data && data.count > 0
					? {
							loading: isFetching,
							offset,
							setOffset,
							totalItems: data.count,
					  }
					: undefined
			}
		>
			<Cards total={data?.total || 10} ongoing={data?.ongoing || 0} completed={data?.completed || 0} />
			<Topbar
				openModal={() => dispatch(modalOpen())}
				loading={isFetching}
				onSubmit={(e: string) => setSearch(e)}
			/>
			{data && data.results.length > 0 ? (
				<div className="gap-4 grid grid-cols-1 p-3 md:gap-5 md:grid-cols-2 lg:gap-6 lg:grid-cols-3">
					{data.results.map((project: ProjectType, index: number) => (
						<Project 
							key={index} 
							{...project} 
							editProject={(id: string, initState: InitStateType) => {
								updateProject.reset()
								setEditId(id); 
								setInitState(initState);
								setEditMode(true);
								dispatch(modalOpen())
							}}
						/>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center">
					<p className="font-semibold my-2 text-center text-sm text-gray-600 md:text-base">
						You currently have zero projects.
					</p>
				</div>
			)}
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						initState={editMode ? initState : undefined}
						editMode={editMode}
						success={createData.status === "fulfilled"}
						errors={
							editMode
								? isFormError<ProjectCreateErrorType>(updateProject.error)
									? updateProject.error.data
									: undefined
								: isFormError<ProjectCreateErrorType>(createData.error)
								? createData.error.data
								: undefined
						}
						loading={editMode ? updateProject.isLoading : createData.isLoading}
						onSubmit={
							editMode && editId
								? (form: ProjectCreateType) =>
										updateProject.onSubmit(editId, form)
								: handleSubmit
						}
					/>
				}
				keepVisible
				description={
					editMode
						? "Fill in the form below to edit this project"
						: "Fill in the form below to add a new project"
				}
				title={editMode ? "Edit Project" : "Add a new Project"}
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Projects;
