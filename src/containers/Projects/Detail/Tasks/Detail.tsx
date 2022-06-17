import { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa";
import { isErrorWithData } from "../../../../store"
import { DEFAULT_IMAGE, EMPLOYEE_PAGE_URL } from "../../../../config"
import { open as alertModalOpen } from "../../../../store/features/alert-modal-slice"
import { open as modalOpen, close as modalClose } from "../../../../store/features/modal-slice";
import { useGetTaskQuery } from "../../../../store/features/projects-slice"
import { useAppDispatch, useAppSelector, useDeleteTask, useUpdateTask } from "../../../../hooks"
import { Container, Modal, PersonCard } from "../../../../components/common";
import { Button } from "../../../../components/controls"
import { TaskForm } from "../../../../components/Projects"
import { TaskCreateType, TaskFormInitStateType } from "../../../../types/employees"


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

	const handleRemoveEmployee = useCallback((employee_id: string) => {
		if (employee_id) {
			const newLeaders = data ? data.leaders.filter(leader => leader.id !== employee_id) : []
			const newTeam = data ? data.followers.filter(member => member.id !== employee_id) : []
			const createData = {
				name: data?.name || "",
				description: data?.description || "",
				priority: data?.priority || "L",
				due_date: data?.due_date || "",
				leaders: newLeaders.map(leader => ({id: leader.id})),
				followers: newTeam.map(member => ({id: member.id})),
			}
			dispatch(alertModalOpen({
				color: "danger",
				header: "Remove Task Follower",
				message: "Do you wish to remove this follower?",
				decisions: [
					{
						bg: "bg-gray-500 hover:bg-gray-400",
						caps: true,
						focus: "",
						onClick: () => {},
						title: "Cancel"
					},
					{
						bg: "bg-red-600 hover:bg-red-500",
						caps: true,
						focus: "",
						onClick: id && task_id ? () => updateTask.onSubmit(id, task_id, createData) : () => {},
						title: "Proceed"
					},
				]
			}))
		}
	}, [dispatch, updateTask, data, id, task_id])

	const appointLeader = useCallback((employee_id: string, appoint: boolean) => {
		if (employee_id) {
			let newLeaders;
			if (appoint === true) {
				newLeaders = data ? [...data.leaders] : []
				const emp = data ? data.followers.find(member => member.id === employee_id) : undefined
				if (emp) newLeaders.push(emp)
			} else {
				newLeaders = data ? data.leaders.filter(leader => leader.id !== employee_id) : undefined
			}

			if (newLeaders) {
				const createData = {
					name: data?.name || "",
					description: data?.description || "",
					priority: data?.priority || "L",
					due_date: data?.due_date || "",
					leaders: newLeaders.map(leader => ({id: leader.id})),
					followers: data ? data.followers.map(member => ({id: member.id})) : [],
				}
				dispatch(alertModalOpen({
					color: "warning",
					header: appoint ? "Add New Leader?" : "Remove Leader?",
					message: appoint ? "Do you wish to appoint this member as a leader?" : "Click Proceed to continue",
					decisions: [
						{
							bg: "bg-gray-500 hover:bg-gray-400",
							caps: true,
							focus: "",
							onClick: () => {},
							title: "Cancel"
						},
						{
							bg: "bg-yellow-600 hover:bg-yellow-500",
							caps: true,
							focus: "",
							onClick: id && task_id ? () => updateTask.onSubmit(id, task_id, createData) : () => {},
							title: "Proceed"
						},
					]
				}))
			}
		}
	}, [dispatch, updateTask, id, task_id, data])

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
			disabledLoading={!isLoading && isFetching}
			error={error && isErrorWithData(error) ? {
				statusCode: error.status || 500,
				title: String(error.data?.detail || error.data?.error || "")
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
						<div className="bg-white my-4 p-4 rounded-md">
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
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Task Leaders
								</h3>
							</div>
							{data && data.leaders && data.leaders.length > 0 ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									{data.leaders.map((leader, index) => (
										<PersonCard 
											key={index}
											title="Team Leader"
											name={leader.full_name || "-----"}
											label={leader.job || "-----"}
											image={{src: leader?.image || DEFAULT_IMAGE}}
											options={[
												{
													bg: "bg-white hover:bg-red-100",
													border: "border border-red-500 hover:border-red-600",
													color: "text-red-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													onClick: () => appointLeader(leader.id, false),
													title: "Remove Leader",
												},
											]}
											actions={[
												{
													bg: "bg-white hover:bg-blue-100",
													border: "border border-primary-500 hover:border-primary-600",
													color: "text-primary-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													link: EMPLOYEE_PAGE_URL(leader.id),
													title: "view profile",
												},
												{
													bg: "bg-white hover:bg-red-100",
													border: "border border-red-500 hover:border-red-600",
													color: "text-red-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													onClick: () => handleRemoveEmployee(leader.id),
													title: "Remove"
												},
											]}
										/>
									))}
								</div>
							) : (
								<p className="text-gray-700 text-sm md:text-base">
									There are currently no task leaders
								</p>
							)}
						</div>
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Task Followers
								</h3>
							</div>
							{data && data.followers && data.followers.length > 0 ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									{data.followers.map((member, index) => (
										<PersonCard 
											key={index}
											title="Task follower"
											name={member.full_name || "-----"}
											label={member.job || "-----"}
											image={{src: member?.image || DEFAULT_IMAGE}}
											options={[
												{
													bg: "bg-white hover:bg-blue-100",
													border: "border border-primary-500 hover:border-primary-600",
													color: "text-primary-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													onClick: () => appointLeader(member.id, true),
													title: "Appoint Leader",
												},
											]}
											actions={[
												{
													bg: "bg-white hover:bg-blue-100",
													border: "border border-primary-500 hover:border-primary-600",
													color: "text-primary-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													link: EMPLOYEE_PAGE_URL(member.id),
													title: "view profile",
												},
												{
													bg: "bg-white hover:bg-red-100",
													border: "border border-red-500 hover:border-red-600",
													color: "text-red-500",
													disabled: updateTask.isLoading || deleteTask.isLoading,
													loading: updateTask.isLoading || deleteTask.isLoading,
													loader: true,
													onClick: () => handleRemoveEmployee(member.id),
													title: "Remove"
												},
											]}
										/>
									))}	
								</div>
							) : (
								<p className="text-gray-700 text-sm md:text-base">
									There are currently no task followers
								</p>
							)}
						</div>
					</div>
					<Modal
						close={() => dispatch(modalClose())}
						component={<TaskForm
								initState={{
									name: data?.name || "",
									description: data?.description || "",
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