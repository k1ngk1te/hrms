import { FC, useState } from "react";
import { FaTimes, FaFileUpload, FaRegFilePdf } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { EMPLOYEE_PAGE_URL } from "../../../config";
import { ProjectFileType } from "../../../types";
import { getTime, downloadFile } from "../../../utils"
import { Button } from "../../controls";
import Form from "./AddProjectFileForm";

export type ProjectFilesProps = {
	files: ProjectFileType[]
}

const ProjectFiles: FC<ProjectFilesProps> = ({ files }) => {
	const { id } = useParams();
	const [visible, setVisible] = useState(false);

	return (
		<div className="bg-white my-4 p-4 rounded-md shadow-lg">
			<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
				uploaded files
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
					<Form
						accept=".doc,.docx,.pdf"
						type="application"
						label="file"
						project_id={id || ""}
						onClose={() => setVisible(false)}
					/>
				</div>
			) : (
				<div className="flex justify-start my-2 w-full px-3">
					<div className="w-2/3 sm:w-1/3 md:w-1/4">
						<Button
							onClick={() => setVisible(true)}
							IconLeft={FaFileUpload}
							rounded="rounded-lg"
							title="add file"
						/>
					</div>
				</div>
			)}
			{files && files.length > 0 ? (
				<ul className="divide-y divide-gray-500 divide-opacity-50 mt-2">
					{files.map((file, index) => {
						const date = new Date(file.date)
						const time = getTime(`${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`)
						const size = String(file.size / (1024 * 1024))
						const sizeString = size.split(".")[0] + "." + size.split(".")[1].slice(0, 2)
						return (
							<li key={index} className="flex items-start py-2">
								<div className="flex items-center justify-center py-4 w-[15%]">
									<span className="flex items-center justify-center">
										<FaRegFilePdf className="text-xl text-gray-700 md:text-2xl" />
									</span>
								</div>
								<div className="w-[85%]">
									<h5 
										onClick={() => downloadFile(file.file, file.name)}
										className="cursor-pointer text-blue-600 text-base hover:text-blue-500 hover:underline"
									>
										{file.name}
									</h5>
									<span>
										{file.uploaded_by && (
											<Link 
												to={file.uploaded_by.id ? EMPLOYEE_PAGE_URL(file.uploaded_by.id) : "#"} 
												className="capitalize cursor-pointer text-red-600 text-sm hover:text-red-500 hover:underline"
											>
												{file.uploaded_by.name}
											</Link>
										)}
										<span className="mx-1 text-gray-700 text-sm">
											{date.toDateString()}{" "}{time}
										</span>
									</span>
									<p className="capitalize text-gray-700 text-sm">
										Size: <span className="font-medium mx-1 uppercase">
											{sizeString}MB
										</span>
									</p>
								</div>
							</li>
						)
					})}
				</ul>
			) : (
				<p className="text-sm text-gray-700">
					There are currently no files/documents on this project.
				</p>
			)}		
		</div>
	);
}

export default ProjectFiles;