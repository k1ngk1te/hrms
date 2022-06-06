import { FC } from "react";
import { FaFileUpload } from "react-icons/fa";
import { ProjectFileType } from "../../../types";
import { Button } from "../../controls";

export type ProjectImagesProps = {
	files: ProjectFileType[]
}

const ProjectImages: FC<ProjectImagesProps> = ({ files }) => (
	<div className="bg-white my-4 p-4 rounded-md shadow-lg">
		<h3
			className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
		>
			uploaded images
		</h3>
		<div className="flex justify-start my-2 w-full px-3">
			<div className="w-2/3 sm:w-1/3 md:w-1/4">
				<Button
					IconLeft={FaFileUpload}
					rounded="rounded-lg"
					title="add images"
				/>
			</div>
		</div>
		{files && files.length > 0 ? (
			<div className="gap-4 grid grid-cols-2 p-3 md:gap-5 md:grid-cols-3 lg:gap-6">
				{files.map((file, index) => (
					<div key={index}>
						<div className="bg-gray-500 h-[100px] rounded-md w-full md:h-[120px] lg:h-[100px]">
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
				There are currently no image files.
			</p>
		)}
	</div>
)

export default ProjectImages;