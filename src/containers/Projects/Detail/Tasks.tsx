import { useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaCheckCircle, FaTimes, FaCheck, FaEye, FaPen, FaPlus, FaFileUpload, FaTrash, FaRegFilePdf } from "react-icons/fa";
import { DEFAULT_IMAGE } from "@/config"
import { isErrorWithData } from "@/store"
import { useGetProjectQuery } from "@/store/features/projects-slice"
import { useFormSelect, useOutClick } from "@/hooks";
import { Container, StatusProgressBar, TabNavigator } from "@/components/common"
import { Button, Select } from "@/components/controls"

const Task = ({ done }: { done: boolean }) => {
	const { buttonRef, ref, setVisible, visible } = useOutClick<
		HTMLDivElement,
		HTMLDivElement
	>();

	return (
		<li className={`${done ? "bg-gray-200" : ""} rounded-b-lg py-1 flex items-center relative py-1`}>
				<div className="flex items-center justify-center w-[15%]">
					<div
						onClick={() => {}}
						className={`border-2 ${!done ? "border-gray-600" : "border-green-600 bg-green-600"} flex items-center justify-center h-[20px] w-[20px] rounded-full`}
					>
						<FaCheck className={`text-xs ${done ? "text-gray-100" : "text-gray-600"}`} />
					</div>
				</div>
				<div className="w-[75%]">
					<p className={`${done ? "text-gray-400" : "text-gray-700"} text-left text-sm`}>
						Patient appointment booking
					</p>
				</div>
				<div className="flex items-center justify-center w-[10%]">
					<span
						ref={buttonRef}
						onClick={() => setVisible(true)}
						className="flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
					>
						<BiDotsVerticalRounded className="cursor-pointer duration-500 text-xl text-gray-700 hover:text-primary-500 hover:scale-105 md:text-2xl lg:text-xl" />
					</span>
				</div>
				<div
				ref={ref}
				className={`${
					visible ? "visible opacity-100" : "opacity-0 invisible"
				} absolute bg-gray-100 p-2 rounded-md right-0 shadow-lg top-0  z-30 w-[85%] xs:w-3/5 sm:w-1/2 md:w-1/4 lg:w-1/3`}
			>
				<div className="flex justify-end p-2 w-full">
					<span
						onClick={() => setVisible(false)}
						ref={buttonRef}
						className="block flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
					>
						<FaTimes className="cursor-pointer duration-500 text-base text-gray-700 hover:text-primary-500 hover:scale-105 md:text-lg lg:text-base" />
					</span>
				</div>
				<ul className="divide-y divde-gray-500 divide-opacity-50">
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-blue-100 focus:ring-2"
							border="border border-primary-400 border-opacity-75"
							caps
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaPen}
							onClick={() => {}}
							title="edit"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-red-100 focus:ring-2"
							border="border border-red-400 border-opacity-75"
							caps
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaTrash}
							onClick={() => {}}
							title="delete"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-green-100 focus:ring-2"
							border="border border-green-400 border-opacity-75"
							caps
							color="text-gray-600 hover:text-gray-800"
							onClick={() => {}}
							IconLeft={FaCheckCircle}
							title="mark as completed"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
				</ul>
			</div>
			</li>
	)
}

const ProjectTasks = () => (
	<ul>
		<Task done={false} />
		<Task done={false} />
		<Task done={false} />
		<Task done />
		<Task done={false} />
		<Task done />
	</ul>
)

const Tasks = () => {
	const { id } = useParams()
	const { data, error, refetch, isLoading, isFetching } = useGetProjectQuery(id || "", {
		skip: id === undefined
	})

	const priority = useFormSelect("H")

	const screens = [
		{title: "all tasks", component: <ProjectTasks />},
		{title: "pending tasks", component: <ProjectTasks />},
		{title: "completed tasks", component: <ProjectTasks />},
	]

	return (
		<Container
			background="bg-gray-100"
			heading="Tasks"
			loading={isLoading}
			refresh={{
				onClick: refetch,
				loading: isFetching
			}}
			icon
			error={isErrorWithData(error) ? {
				statusCode: error?.status || 500,
				title: String(error.data?.detail || error.data?.error || "")
			} : undefined}
			title="hospital adminisration"
		>
			<div className="p-2">
				<div className="flex justify-end w-full sm:px-4">
					<div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
						<Button
							IconLeft={FaPlus}
							rounded="rounded-xl"
							title="add tasks"
						/>
					</div>
				</div>
				<div className="py-2 w-full sm:px-4">
					<div className="bg-white my-4 p-4 rounded-md shadow-lg">
						<div className="my-2">
							<h3
								className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
							>
								hospital adminisration
							</h3>
						</div>
						<div className="my-1">
							<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
								1 <span className="font-bold text-gray-600">open tasks</span>,
							</span>
							<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
								9 <span className="font-bold text-gray-600">tasks completed</span>
							</span>
						</div>
						<div className="my-2">
							<TabNavigator container="" screens={screens} />
						</div>
					</div>

				</div>
			</div>
		</Container>
	)
}

export default Tasks;