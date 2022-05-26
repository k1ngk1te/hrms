import { useState } from "react"
import { isErrorWithData } from "@/store";
import { open as modalOpen, close as modalClose } from "@/store/features/modal-slice";
import { useGetProjectsQuery, useCreateProjectMutation } from "@/store/features/projects-slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Container, Modal } from "@/components/common"
import { Cards, Form, Project, Topbar } from "@/components/Projects";
import { ProjectType, ProjectCreateType } from "@/types/employees";

const Projects = () => {
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	const [editMode, setEditMode] = useState(false)

	const dispatch = useAppDispatch()
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const { data, error, refetch, isLoading, isFetching } = useGetProjectsQuery({ limit: 50, offset, search })
	const [createProject, createData] = useCreateProjectMutation()

	return (
		<Container
			background="bg-gray-100"
			heading="Projects"
			loading={isLoading}
			refresh={{
				onClick: refetch,
				loading: isFetching
			}}
			error={isErrorWithData(error) ? {
				statusCode: error?.status || 500,
				title: String(error.data?.detail || error.data?.error || "")
				} : undefined}
			paginate={data && data.count > 0 ? {
				loading: isFetching, offset, setOffset, totalItems: data.count
			} : undefined}
		>
			<Cards total={10} ongoing={7} completed={3} />
			<Topbar
				openModal={() => dispatch(modalOpen())}
				loading={isFetching}
				onSubmit={(e: string) => setSearch(e)}
			/>
			{data && data.results.length > 0 ? (
				<div className="gap-4 grid grid-cols-1 p-3 md:gap-5 md:grid-cols-2 lg:gap-6 lg:grid-cols-3">
					{data.results.map((project: ProjectType, index: number) => (
						<Project key={index} {...project} />
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
				component={<Form
					loading={createData.isLoading}
					onSubmit={(form: ProjectCreateType) => createProject(form)}
				/>}
				editMode={editMode}
				keepVisible
				description={editMode ? "Fill in the form below to edit this project" : "Fill in the form below to add a new project"}
				title={editMode ? "Edit Project" : "Add a new Project"}
				visible={modalVisible}
			/>
		</Container>
	)
}

export default Projects