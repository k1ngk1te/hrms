import { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa";
import { CLIENT_PAGE_URL, EMPLOYEE_PAGE_URL } from "../../../config";
import { isErrorWithData } from "../../../store"
import { open as alertModalOpen } from "../../../store/features/alert-modal-slice"
import { useGetProjectQuery } from "../../../store/features/projects-slice"
import { useAppDispatch, useUpdateProject } from "../../../hooks";
import { Container, PersonCard } from "../../../components/common";


const Team = () => {
	const {id} = useParams();

	const { data, error, isLoading, isFetching, refetch } = useGetProjectQuery(id || "", {
		skip: id === undefined
	})

	const dispatch = useAppDispatch();

	const updateProject = useUpdateProject();

	const handleRemoveEmployee = useCallback((employee_id: string) => {
		if (employee_id) {
			const newLeaders = data.leaders.filter(leader => leader.id !== employee_id)
			const newTeam = data.team.filter(member => member.id !== employee_id)
			const createData = {
				name: data.name,
				initial_cost: data.initial_cost,
				rate: data.rate,
				description: data.description,
				priority: data.priority,
				start_date: data.start_date,
				end_date: data.end_date,
				leaders: newLeaders.map(leader => ({id: leader.id})),
				team: newTeam.map(member => ({id: member.id})),
			}
			dispatch(alertModalOpen({
				color: "danger",
				header: "Remove Team Member",
				message: "Do you wish to remove this member?",
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
						onClick: () => updateProject.onSubmit(id, createData),
						title: "Proceed"
					},
				]
			}))
		}
	}, [dispatch, updateProject, data])

	const appointLeader = useCallback((employee_id: string, appoint: boolean) => {
		if (employee_id) {
			let newLeaders;
			if (appoint === true) {
				newLeaders = [...data.leaders]
				const emp = data.team.find(member => member.id === employee_id)
				newLeaders.push(emp)
			} else {
				newLeaders = data.leaders.filter(leader => leader.id !== employee_id)
			}

			const createData = {
				name: data.name,
				initial_cost: data.initial_cost,
				rate: data.rate,
				description: data.description,
				priority: data.priority,
				start_date: data.start_date,
				end_date: data.end_date,
				leaders: newLeaders.map(leader => ({id: leader.id})),
				team: data.team.map(member => ({id: member.id})),
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
						onClick: () => updateProject.onSubmit(id, createData),
						title: "Proceed"
					},
				]
			}))
		}
	}, [dispatch, updateProject, data])

	useEffect(() => {
		if (updateProject.success) {
			dispatch(alertModalOpen({
				color: "success",
				header: "Project Info Updated",
				message: "Project information was updated successfully!",
			}))
		}
	}, [updateProject.success])


	return (
		<Container
			background="bg-gray-100"
			heading="Team Information"
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
					<div className="py-2 w-full sm:px-4">
						<div className="bg-white p-4 rounded-md">
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
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Creator
								</h3>
							</div>
							{data.created_by ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									<PersonCard 
										title="Project Creator"
										name={data.created_by.full_name || "-----"}
										label={data.created_by.job || "-----"}
									/>								
								</div>
							) : (
								<p className="my-2 text-center text-gray-700 text-sm md:text-base">
									Project creator information is not available.
								</p>
							)}
						</div>
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Client
								</h3>
							</div>
							{data.client ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									<PersonCard 
										title={data.client.company || "------"}
										name={data.client.contact.full_name || "------"}
										label={data.client.position || "------"}
										actions={[
											{
												bg: "bg-white hover:bg-success-100",
												border: "border border-success-500 hover:border-success-600",
												color: "text-success-500",
												disabled: updateProject.isLoading,
												loading: updateProject.isLoading,
												loader: true,
												link: CLIENT_PAGE_URL(data.client.id),
												title: "view profile",
											},
										]}
									/>								
								</div>
							) : (
								<p className="my-2 text-center text-gray-700 text-sm md:text-base">
									Client information is not available.
								</p>
							)}
						</div>
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Leaders
								</h3>
							</div>
							{data.leaders && data.leaders.length > 0 ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									{data.leaders.map((leader, index) => (
										<PersonCard 
											key={index}
											title="Team Leader"
											name={leader.full_name || "-----"}
											label={leader.job || "-----"}
											options={[
												{
													bg: "bg-white hover:bg-red-100",
													border: "border border-red-500 hover:border-red-600",
													color: "text-red-500",
													disabled: updateProject.isLoading,
													loading: updateProject.isLoading,
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
													disabled: updateProject.isLoading,
													loading: updateProject.isLoading,
													loader: true,
													link: EMPLOYEE_PAGE_URL(leader.id),
													title: "view profile",
												},
												{
													bg: "bg-white hover:bg-red-100",
													border: "border border-red-500 hover:border-red-600",
													color: "text-red-500",
													disabled: updateProject.isLoading,
													loading: updateProject.isLoading,
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
									There are currently no team leaders
								</p>
							)}
						</div>
						<div className="bg-gray-200 my-4 p-4 rounded-md">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Team
								</h3>
							</div>
							{data.team && data.team.length > 0 ? (
								<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-4">
									{data.team.map((member, index) => {
										if (data.leaders.some(leader => leader.id === member.id) === false) {
											return (
												<PersonCard 
													key={index}
													title="Team member"
													name={member.full_name || ""}
													job={member.job || ""}
													options={[
														{
															bg: "bg-white hover:bg-success-100",
															border: "border border-success-500 hover:border-success-600",
															color: "text-success-500",
															disabled: updateProject.isLoading,
															loading: updateProject.isLoading,
															loader: true,
															onClick: () => appointLeader(member.id, true),
															title: "Appoint Leader",
														},
													]}
													actions={[
														{
															bg: "bg-white hover:bg-success-100",
															border: "border border-success-500 hover:border-success-600",
															color: "text-success-500",
															disabled: updateProject.isLoading,
															loading: updateProject.isLoading,
															loader: true,
															link: EMPLOYEE_PAGE_URL(member.id),
															title: "view profile",
														},
														{
															bg: "bg-white hover:bg-red-100",
															border: "border border-red-500 hover:border-red-600",
															color: "text-red-500",
															disabled: updateProject.isLoading,
															loading: updateProject.isLoading,
															loader: true,
															onClick: () => handleRemoveEmployee(member.id),
															title: "Remove"
														},
													]}
												/>
											)
										}
									})}	
								</div>
							) : (
								<p className="text-gray-700 text-sm md:text-base">
									There are currently no team members
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</Container>
	)
}

export default Team