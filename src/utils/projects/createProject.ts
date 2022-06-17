import { ProjectType, ProjectCreateType, UserEmployeeType } from "../../types"

const createProject = (project: ProjectType): ProjectCreateType => ({
	name: project.name,
	client: project.client ? project.client.id : "",
	priority: project.priority,
	description: project.description || "",
	leaders: project.leaders.map((leader: UserEmployeeType) => ({id: leader.id})),
    team: project.team.map((team: UserEmployeeType) => ({id: team.id})),
    start_date: project.start_date,
    end_date: project.end_date,
    initial_cost: project.initial_cost,
	rate: project.rate
})

export default createProject