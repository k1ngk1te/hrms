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

import { DEFAULT_IMAGE, PROJECT_PAGE_URL } from "../../config";
import { useOutClick, useDeleteProject, useMarkProject } from "../../hooks";
import { Avatars, StatusProgressBar } from "../common";
import { Button, Loader } from "../controls";
import { UserEmployeeType, ProjectType } from "../../types/employees";
import { InitStateType } from "./Form";

const ImageBlocks = ({ team }: { team: UserEmployeeType[] }) => {
	const images = team.slice(0, 4).map((person) => ({
		src: person.image || DEFAULT_IMAGE,
		alt: ""
	}))

	return (
		<>
			{team.length > 0 ? (
				<div className="flex flex-wrap items-center mt-1">
					<Avatars images={images} more={team.length > 4 ? `+${team.length - 4}` : undefined} />
					
				</div>
			) : (
				<p className="capitalize font-semibold my-1 text-gray-500 text-sm md:text-base lg:text-sm">
					-----------------
				</p>
			)}
		</>
	);
}

export interface ProjectObjecttype extends ProjectType {
	editProject: (id: string, string: InitStateType) => void;
}

const Project = ({
	id,
	start_date,
	client,
	completed,
	end_date,
	name,
	initial_cost,
	rate,
	description,
	priority,
	team,
	leaders,
	editProject,
}: ProjectObjecttype) => {
	const { buttonRef, ref, setVisible, visible } = useOutClick<
		HTMLDivElement,
		HTMLSpanElement
	>();

	const markProject = useMarkProject()
	const deleteProject = useDeleteProject()

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
			<div className="my-1">
				<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
					{description.slice(0, 75)} {description.length > 75 ? "..." : ""}
				</p>
			</div>
			<div className="flex flex-wrap items-end my-1">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Priority:
				</h6>
				<p
					className={`${
						priority === "H"
							? "text-red-600"
							: priority === "M"
							? "text-yellow-600"
							: "text-green-600"
					} capitalize flex flex-wrap items-center font-semibold mx-2 text-sm md:text-base lg:text-sm`}
				>
					{priority === "H" ? "High" : priority === "M" ? "Medium" : "Low"}
					<span className="mx-2 pb-1">
						<FaExclamationCircle className="text-sm" />
					</span>
				</p>
			</div>
			<div className="flex flex-wrap items-end my-1">
				<h6 className="capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Status:
				</h6>
				<p
					className={`${
						completed
							? "text-green-600"
							: "text-yellow-600"
					} capitalize flex flex-wrap items-center font-semibold mx-2 text-sm md:text-base lg:text-sm`}
				>
					{completed ? "completed" : "ongoing"}
					{completed ? (
						<span className="mx-2 pb-1">
							<FaCheckCircle className="text-sm" />
						</span>
					) : (
						<span className="mx-2 pb-1">
							<FaExclamationCircle className="text-sm" />
						</span>
					)}
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
				<h6 className="font-medium text-gray-800 text-base md:text-lg lg:text-base">
					Team Leader{leaders.length > 1 ? "s" : ""}:
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
							bg="bg-gray-50 hover:bg-yellow-100"
							border="border border-secondary-400 border-opacity-75"
							caps
							focus=""
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaEye}
							link={PROJECT_PAGE_URL(id || "#")}
							title="view"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-blue-100"
							border="border border-primary-400 border-opacity-75"
							caps
							focus=""
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaPen}
							onClick={() =>
								editProject(id, {
									name,
									description,
									priority,
									leaders: leaders.map((leader) => leader.id),
									team: team.map((member) => member.id),
									start_date,
									end_date,
									client: client.id,
									initial_cost,
									rate,
								})
							}
							title="edit"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-red-100"
							border="border border-red-400 border-opacity-75"
							caps
							focus=""
							color="text-gray-600 hover:text-gray-800"
							IconLeft={FaTrash}
							disabled={deleteProject.isLoading}
							loading={deleteProject.isLoading}
							loader
							onClick={() => {
								deleteProject.reset()
								deleteProject.onSubmit(id)
							}}
							title="delete"
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
					<li className="p-1 w-full">
						<Button
							bg="bg-gray-50 hover:bg-green-100"
							border="border border-green-400 border-opacity-75"
							caps
							focus=""
							color="text-gray-600 hover:text-gray-800"
							disabled={markProject.isLoading}
							loading={markProject.isLoading}
							loader
							onClick={() => markProject.onSubmit(id, !completed)}
							IconLeft={FaCheckCircle}
							title={completed ? "mark ongoing" : "mark as completed"}
							titleSize="text-sm md:text-base lg:text-sm"
						/>
					</li>
				</ul>
			</div>
			{(markProject.isLoading || deleteProject.isLoading) && (
				<div 
					className="absolute flex items-center justify-center left-0 h-full rounded-md shadow-lg top-0 w-full z-10"
					style={{ background: "rgba(0, 0, 0, 0.4)" }}
				>
					<Loader size={4} type="dotted" width="sm" />
				</div>
			)}
		</div>
	);
};

export default Project;
