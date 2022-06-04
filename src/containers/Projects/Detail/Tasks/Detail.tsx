import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa";
import { isErrorWithData } from "../../../../store"
import { open as alertModalOpen } from "../../../../store/features/alert-modal-slice"
import { open as modalOpen, close as modalClose } from "../../../../store/features/modal-slice";
import { useGetTaskQuery } from "../../../../store/features/projects-slice"
import { useAppDispatch, useAppSelector, useDeleteTask, useUpdateTask } from "../../../../hooks"
import { Container, Modal, PersonCard } from "../../../../components/common";
import { Button } from "../../../../components/controls"
import { TaskForm } from "../../../../components/Projects"
import { TaskCreateType } from "../../../../types/employees"


const Detail = () => {
	const {id, task_id} = useParams()

	const { data, error, isLoading, isFetching, refetch } = useGetTaskQuery({
		project_id: id || "", id: task_id || ""
	}, {
		skip: id === undefined || task_id === undefined
	})

	const dispatch = useAppDispatch()
	const modalVisible = useAppSelector(state => state.modal.visible)

	const updateTask = useUpdateTask()
	const deleteTask = useDeleteTask()

	useEffect(() => {
		if (updateTask.success === true) {
			dispatch(modalClose());
			dispatch(alertModalOpen({
				header: "Task Updated",
				color: "success",
				message: "Task Updated Successfully!"
			}))
		}
	}, [dispatch, updateTask.success])

	return (
		<Container
			background="bg-gray-100"
			heading="Task Information"
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
			loading={isLoading}
			title={data ? data.name : undefined}
		>
			{data && (
				<div className="p-2 w-full">
					<div className="flex flex-wrap items-center w-full sm:px-4 lg:justify-end">
						<div className="my-2 w-full sm:px-2 sm:w-1/3 md:w-1/4 lg:w-1/5">
							<Button
								IconLeft={FaPen}
								onClick={() => dispatch(modalOpen())}
								rounded="rounded-xl"
								title="edit task"
							/>
						</div>
						<div className="my-2 w-full sm:px-2 sm:w-1/3 md:w-1/4 lg:w-1/5">
							<Button
								bg="bg-red-600 hover:bg-red-500"
								focus="focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
								IconLeft={FaTrash}
								rounded="rounded-xl"
								title="delete task"
								onClick={id !== undefined && task_id !== undefined ? () => deleteTask.onSubmit(id, task_id) : undefined}
							/>
						</div>
					</div>
					<div className="py-2 w-full sm:px-4">
						<div className="bg-white p-4 rounded-md shadow-lg">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									{data.name}
								</h3>
							</div>
							<div className="my-1">
								<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
									5{" "}
									<span className="font-bold mx-2 text-gray-600">followers</span>,
								</span>
							</div>
							<div className="my-1">
								<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
									{data.description || ""}
								</p>
							</div>
						</div>
						{data.leaders && data.leaders.length > 0 && (
							<div className="bg-gray-100 p-4 rounded-md shadow-lg">
								<div className="my-2">
									<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
										Task Leaders
									</h3>
								</div>
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-3">
									{data.leaders.map((leader, index) => (
										<PersonCard 
											key={index}
											name={leader.full_name}
											label={leader.job}
										/>	
									))}
								</div>
							</div>
						)}
						{data.followers && data.followers.length > 0 && (
							<div className="bg-gray-100 p-4 rounded-md shadow-lg">
								<div className="my-2">
									<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
										Task Followers
									</h3>
								</div>
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-3">
									{data.followers.map((follower, index) => (
										<PersonCard 
											key={index}
											name={follower.full_name}
											label={follower.job}
										/>								
									))}
								</div>
							</div>
						)}	
					</div>
					<Modal
						close={() => dispatch(modalClose())}
						component={<TaskForm
								initState={{
									name: data.name || "",
									description: data.description || "",
									leaders: data ?  data.leaders.map(leader => leader.id) : [],
									followers: data ?  data.followers.map(follower => follower.id) : [],
									priority: data.priority || "H",
									due_date: data.due_date || "",
								}}
								editMode
								errors={updateTask.error}
								onSubmit={(form: TaskCreateType) => {
									if (id && task_id)
										updateTask.onSubmit(id, task_id, form)
								}}
								loading={updateTask.isLoading}
							/>}
						description="Fill in the form below to update the task"
						title="Update Task"
						visible={modalVisible}
					/>
				</div>
			)}
		</Container>
	)
}

export default Detail