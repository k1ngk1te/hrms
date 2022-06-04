import { FaFileUpload, FaRegFilePdf } from "react-icons/fa";
import { Button } from "../../controls";

const ProjectFiles = () => (
	<div className="bg-white my-4 p-4 rounded-md shadow-lg">
		<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
			uploaded files
		</h3>
		<div className="flex justify-start my-2 w-full px-3">
			<div className="w-2/3 sm:w-1/3 md:w-1/4">
				<Button
					IconLeft={FaFileUpload}
					rounded="rounded-lg"
					title="add files"
				/>
			</div>
		</div>
		<ul className="divide-y divide-gray-500 divide-opacity-50 mt-2">
			<li className="flex items-start py-2">
				<div className="flex items-center justify-center py-4 w-[15%]">
					<span className="flex items-center justify-center">
						<FaRegFilePdf className="text-xl text-gray-700 md:text-2xl" />
					</span>
				</div>
				<div className="w-[85%]">
					<h5 className="cursor-pointer text-blue-600 text-base hover:text-blue-500 hover:underline">
						AHA Selfcare Mobile Application Test-Cases.xls
					</h5>
					<span>
						<span className="capitalize cursor-pointer text-red-600 text-sm hover:text-red-500 hover:underline">
							john doe
						</span>
						<span className="mx-1 text-gray-700 text-sm">
							May 31st at 6:53PM
						</span>
					</span>
					<p className="capitalize text-gray-700 text-sm">
						Size: <span className="font-medium mx-1 uppercase">14.8MB</span>
					</p>
				</div>
			</li>
			<li className="flex items-start py-2">
				<div className="flex items-center justify-center py-4 w-[15%]">
					<span className="flex items-center justify-center">
						<FaRegFilePdf className="text-xl text-gray-700 md:text-2xl" />
					</span>
				</div>
				<div className="w-[85%]">
					<h5 className="cursor-pointer text-blue-600 text-base hover:text-blue-500 hover:underline">
						AHA Selfcare Mobile Application Test-Cases.xls
					</h5>
					<span>
						<span className="capitalize cursor-pointer text-red-600 text-sm hover:text-red-500 hover:underline">
							john doe
						</span>
						<span className="mx-1 text-gray-700 text-sm">
							May 31st at 6:53PM
						</span>
					</span>
					<p className="capitalize text-gray-700 text-sm">
						Size: <span className="font-medium mx-1 uppercase">14.8MB</span>
					</p>
				</div>
			</li>
		</ul>
	</div>
);

export default ProjectFiles;
