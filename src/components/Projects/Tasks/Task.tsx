import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaCheck, FaCheckCircle, FaPen, FaTimes, FaTrash } from "react-icons/fa";

import { useOutClick } from "../../../hooks";
import { Button } from "../../controls"

const Task = ({ title, completed }: { completed: boolean; title: string }) => {
	const { buttonRef, ref, setVisible, visible } = useOutClick<
		HTMLDivElement,
		HTMLDivElement
	>();

	return (
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
		</div>
	)
}

export default Task;