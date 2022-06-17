import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../../../config";
import { isErrorWithData, isFormError } from "../../../../store";
import { logout } from "../../../../store/features/auth-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../../../store/features/modal-slice";
import { open as alertModalOpen } from "../../../../store/features/alert-modal-slice";
import { useGetTasksQuery, useCreateTaskMutation } from "../../../../store/features/projects-slice";
import { useAppDispatch, useAppSelector, useDeleteTask, useUpdateTask } from "../../../../hooks";
import { TaskCards, TaskForm, TaskTable, TaskTopbar } from "../../../../components/Projects"
import { Container, Modal } from "../../../../components/common";
import { TaskCreateType, TaskCreateErrorType, TaskFormInitStateType } from "../../../../types/employees";


const Tasks = () => {
	const { id } = useParams()
	const [editMode, setEditMode] = useState(false)
	const [editId, setEditId] = useState<string | undefined>(undefined)
	const [initState, setInitState] = useState<TaskFormInitStateType | undefined>(undefined)

	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");

	const { data, error, isFetching, refetch, isLoading } = useGetTasksQuery({
		project_id: id || "",
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search,
	}, {
		skip: id === undefined
	})

	const [createTask, createData] = useCreateTaskMutation();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const handleSubmit = useCallback((form: TaskCreateType) => {
		if (id) createTask({project_id:id, data: form})
	}, [createTask, id])

	useEffect(() => {
		if (createData.error && isErrorWithData(createData.error)) {
			if (createData.error.status === 401) dispatch(logout())
			else {
				const error = createData.error.data.detail || createData.error.data.error || "A server error occurred"
				dispatch(alertModalOpen({
					header: "Failed to create task",
					color: "danger",
					message: String(error)
				}))
			}
		}
	}, [createData.error, dispatch])

	useEffect(() => {
		if (createData.status === "fulfilled") {
			dispatch(modalClose());
			dispatch(alertModalOpen({
				header: "Task Created",
				color: "success",
				message: "Task Created Successfully!"
			}))
			setInitState(undefined);
			setEditId(undefined);
			setEditMode(false)
		}
	}, [dispatch, createData.status])

	useEffect(() => {
		if (editMode && updateTask.success === true) {
			dispatch(modalClose());
			dispatch(alertModalOpen({
				header: "Task Updated",
				color: "success",
				message: "Task Updated Successfully!"
			}))
		}
	}, [dispatch, editMode, updateTask.success])

	return (
		<Container
			heading="Tasks"
			refresh={{
				loading: isFetching,
				onClick: refetch,
			}}
			error={error && isErrorWithData(error) ? {
				statusCode: error.status || 500,
				title: String(error.data.detail || error.data.error || "")
				} : undefined
			}
			icon
			disabledLoading={!isLoading && isFetching}
			loading={isLoading}
			paginate={data ? {
				offset, setOffset, loading: isFetching,
				totalItems: data.count || 0
			} : undefined}
			title={data ? data.project.name : undefined}
		>
			<TaskCards
				pending={data ? data.ongoing : 0}
				completed={data ? data.completed : 0}
				total={data ? data.total : 0}
			/>
			<TaskTopbar
				openModal={() => {
					setInitState(undefined);
					setEditId(undefined);
					setEditMode(false)
					dispatch(modalOpen());
				}}
				loading={isFetching}
				onSubmit={(name: string) => setSearch(name)}
			/>
			<div className="mt-3">
				<TaskTable
					tasks={data ? data.results : []}
					onEdit={(id: string, initState: TaskFormInitStateType) => {
						setEditId(id);
						setInitState(initState);
						setEditMode(true);
						dispatch(modalOpen())
					}}
					deleteLoading={deleteTask.isLoading}
					onDelete={(task_id: string) => {
						if (id) deleteTask.onSubmit(id, task_id)
					}}
				/>
			</div>
			<Modal
				close={() => dispatch(modalClose())}
				component={<TaskForm
						initState={editMode ? initState : undefined}
						editMode={editMode}
						errors={
							editMode ? updateTask.error :
							isFormError<TaskCreateErrorType>(createData.error) ? createData.error.data : undefined
						}
						onSubmit={editMode ? (form: TaskCreateType) => {
							if (id && editId)
								updateTask.onSubmit(id, editId, form)
						} : handleSubmit}
						loading={editMode ? updateTask.isLoading : createData.isLoading}
						success={createData.status === "fulfilled"}
					/>}
				description={editMode ? "Fill in the form below to update the task" : "Fill in the form below to add a new Task"}
				title={editMode ? "Update Task" : "Add Task"}
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Tasks;
