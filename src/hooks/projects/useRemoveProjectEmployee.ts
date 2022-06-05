import { useCallback } from "react";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import useUpdateProject from "./useUpdateProject";
import { useAppDispatch } from "../index";
import { ProjectType } from "../../types";
import { createProject } from "../../utils/projects";

const useRemoveProjectEmployee = () => {
	const dispatch = useAppDispatch();

	const updateProject = useUpdateProject();

	const handleRemoveEmployee = useCallback((data: ProjectType, employee_id: string) => {
		
		const newLeaders = data.leaders.filter(leader => leader.id !== employee_id)
		const newTeam = data.team.filter(member => member.id !== employee_id)

		const createData = { 
			...createProject(data), 
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
					onClick: () => updateProject.onSubmit(data.id, createData),
					title: "Proceed"
				},
			]
		}))
	}, [dispatch, updateProject])

	return {
		isLoading: updateProject.isLoading,
		onSubmit: handleRemoveEmployee,
		success: updateProject.success
	}
}

export default useRemoveProjectEmployee