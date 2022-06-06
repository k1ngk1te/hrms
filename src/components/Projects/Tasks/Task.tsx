import { FaCheck } from "react-icons/fa";

const Task = ({ title, completed }: { completed: boolean; title: string }) => (
	<div className={`${completed ? "bg-gray-200" : ""} rounded-b-lg py-1 flex items-center relative py-1`}>
		<div className="flex items-center justify-center w-[15%]">
			<div
				onClick={() => {}}
				className={`border-2 ${!completed ? "border-gray-600" : "border-green-600 bg-green-600"} flex items-center justify-center h-[20px] w-[20px] rounded-full`}
			>
				<FaCheck className={`text-xs ${completed ? "text-gray-100" : "text-gray-600"}`} />
			</div>
		</div>
		<div className="w-[75%]">
			<p className={`${completed ? "text-gray-400" : "text-gray-700"} text-left text-sm`}>
				{title}
			</p>
		</div>
	</div>
)

export default Task;