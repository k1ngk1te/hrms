import { useCallback } from "react";
import useUpdateProject from "./useUpdateProject";
import { useAppDispatch } from "../index"
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { ProjectType } from "../../types";
import { createProject } from "../../utils/projects";

const useAppointProjectLeader = () => {
	const dispatch = useAppDispatch();
	const updateProject = useUpdateProject();
	const appointLeader = useCallback((data: ProjectType, employee_id: string, appoint: boolean) => {
		let newLeaders;
		if (appoint === true) {
			newLeaders = [...data.leaders]
			const emp = data.team.find(member => member.id === employee_id)
			if (emp) newLeaders.push(emp)
		} else {
			newLeaders = data.leaders.filter(leader => leader.id !== employee_id)
		}

		const createData = { 
			...createProject(data), 
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
					onClick: () => updateProject.onSubmit(data.id, createData),
					title: "Proceed"
				},
			]
		}))
	}, [dispatch, updateProject])

	return {
		onSubmit: appointLeader,
		isLoading: updateProject.isLoading,
		success: updateProject.success,
		error: updateProject.error
	}
}

export default useAppointProjectLeader