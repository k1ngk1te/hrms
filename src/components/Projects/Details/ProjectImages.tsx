import { FC, useState } from "react";
import { useParams } from "react-router-dom"
import { FaTimes, FaFileUpload } from "react-icons/fa";
import { ProjectFileType } from "../../../types";
import { Button } from "../../controls";
import Form from "./AddProjectFileForm";

export type ProjectImagesProps = {
	files: ProjectFileType[]
}

const ProjectImages: FC<ProjectImagesProps> = ({ files }) => {
	const { id } = useParams();
	const [visible, setVisible] = useState(false)

	return (
		<div className="bg-white my-4 p-4 rounded-md shadow-lg">
			<h3
				className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
			>
				uploaded images
			</h3>
			{visible ? (
				<div>
					<div className="flex justify-end">
						<div
							onClick={() => setVisible(false)}
							className="cursor-pointer duration-500 mx-4 p-2 rounded-full text-primary-500 text-xs transform transition-all hover:bg-gray-200 hover:scale-110 hover:text-gray-600 md:text-sm"
						>
							<FaTimes className="text-xs sm:text-sm" />
						</div>
					</div>
					<Form label="image" project_id={id || ""} onClose={() => setVisible(false)} />	
				</div>
			) : (
				<div className="flex justify-start my-2 w-full px-3">
					<div className="w-2/3 sm:w-1/3 md:w-1/4">
						<Button
							IconLeft={FaFileUpload}
							onClick={() => setVisible(true)}
							rounded="rounded-lg"
							title="add image"
						/>
					</div>
				</div>
			)}
			{files && files.length > 0 ? (
				<div className="gap-4 grid grid-cols-2 p-3 md:gap-5 md:grid-cols-3 lg:gap-6">
					{files.map((file, index) => (
						<div key={index}>
							<div className="bg-gray-500 h-[120px] rounded-md w-full md:h-[150px] lg:h-[120px]">
								<img
									className="h-full rounded-md w-full"
									src={file.file}
									alt=""
								/>
							</div>
							<p className="my-1 text-left text-sm text-gray-700 md:text-base">
								{file.name.split(0, 40)}{file.name.length > 40 ? "..." : ""}
							</p>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-gray-700">
					There are currently no images stored on this project.
				</p>
			)}
		</div>
	)
}

export default ProjectImages;