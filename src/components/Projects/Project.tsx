import { Link } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
	FaCheckCircle,
	FaExclamationCircle,
	FaEye,
	FaPen,
	FaTimes,
	FaTrash,
} from "react-icons/fa";

import { DEFAULT_IMAGE, PROJECT_PAGE_URL } from "@/config";
import { useOutClick } from "@/hooks";
import { StatusProgressBar } from "@/components/common";
import { Button } from "@/components/controls";
import { IndexUserType, ProjectType } from "@/types/employees";

const ImageBlocks = ({
	team,
}: {
	team: IndexUserType[];
}) => (
	<>
		{team.length > 0 ? (
			<div className="flex flex-wrap items-center mt-1">
				{team.slice(0, 4).map((person, index) => (
					<div
						key={index}
						className="h-[25px] mx-1 w-[25px] rounded-full md:h-[30px] md:w-[30px]"
					>
						<img
							className="h-full rounded-full w-full"
							src={person.image || DEFAULT_IMAGE}
							alt=""
						/>
					</div>
				))}
				{team.length > 4 && (
					<div className="bg-red-600 flex h-[20px] items-center justify-center mx-1 rounded-full w-[20px] xs:h-[25px] xs:w-[25px] md:h-[30px] md:w-[30px] lg:h-[25px] lg:w-[25px]">
						<span className="text-xs text-white">+{team.length - 4}</span>
					</div>
				)}
			</div>
		) : (
			<p className="capitalize font-semibold my-1 text-gray-500 text-sm md:text-base lg:text-sm">
				-----------------
			</p>
		)}
	</>
);

const Project = ({
	id,
	end_date,
	name,
	description,
	priority,
	team,
	leaders,
}: ProjectType) => {
	const { buttonRef, ref, setVisible, visible } = useOutClick<
		HTMLDivElement,
		HTMLSpanElement
	>();

	return (
		<div className="bg-white p-4 relative rounded-md shadow-lg">
			<div className="flex items-center justify-between mb-2">
				<Link
					to={PROJECT_PAGE_URL(id || "#")}
					className="capitalize cursor-pointer duration-500 font-semibold text-base text-gray-800 tracking-wide hover:scale-105 hover:text-secondary-500 md:text-lg lg:text-base"
				>
					{name}
				</Link>
				<span
					onClick={() => setVisible(true)}
					ref={buttonRef}
					className="block flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
				>
					<BiDotsVerticalRounded className="cursor-pointer duration-500 text-xl text-gray-700 hover:text-primary-500 hover:scale-105 md:text-2xl lg:text-xl" />
				</span>
			</div>
			<div className="mb-1">
				<span className="font-medium mr-1 text-gray-800 text-sm">
					1 <span className="font-bold text-gray-600">open tasks</span>,
				</span>
				<span className="font-medium mr-1 text-gray-800 text-sm">
					9 <span className="font-bold text-gray-600">tasks completed</span>
				</span>
			</div>
			<div className="my-1">
				<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
					{description.slice(0, 135)} {description.length > 135 ? "..." : ""}
				</p>
			</div>
			<div className="flex flex-wrap items-end my-1">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Priority:
				</h6>
				<p className={`${
					priority === "H" ? "text-red-600" : priority === "M" ? "text-yellow-600" : "text-success-600"
				} capitalize flex flex-wrap items-center font-semibold mx-2 text-sm md:text-base lg:text-sm`}>
					{priority === "H" ? "High" : priority === "M" ? "Medium" : "Low"}
					<span className="mx-2 pb-1">
						<FaExclamationCircle className="text-sm" />
					</span>
				</p>
			</div>
			<div className="flex flex-wrap items-end my-1">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Deadline:
				</h6>
				<p className="capitalize font-semibold mx-2 text-gray-500 text-sm md:text-base lg:text-sm">
					{end_date ? new Date(end_date).toDateString() : "----------"}
				</p>
			</div>
			<div className="my-1">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Team Leader:
				</h6>
				<ImageBlocks team={leaders} />
			</div>
			<div className="my-2">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Team:
				</h6>
				<ImageBlocks team={team} />
			</div>
			<div className="mt-6 mb-3">
				<StatusProgressBar
					background="bg-green-600"
					title="Progress"
					result={0.4}
					value="40%"
				/>
			</div>
			<div
				ref={ref}
				className={`${
					visible ? "visible opacity-100" : "opacity-0 invisible"
				} absolute bg-gray-100 p-2 rounded-md right-0 shadow-lg top-0 w-[85%] xs:w-3/5 sm:w-1/2 lg:w-2/3`}
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
							bg="bg-gray-50 hover:bg-yellow-100 focus:ring-2"
							border="border border-secondary-400 border-opacity-75"
							caps
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaEye}
							link={PROJECT_PAGE_URL(id || "#")}
							title="view"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
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
	);
};

export default Project;
