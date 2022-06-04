import { DEFAULT_IMAGE } from "../../../config";
import { useFormSelect } from "../../../hooks";
import { StatusProgressBar } from "../../common";
import { Select } from "../../controls";

const ProjectDetail = () => {
	const priority = useFormSelect("H");

	return (
		<div className="py-2 w-full sm:px-4 lg:w-1/3">
			<div className="flex flex-col items-center md:flex-row md:items-start lg:flex-col lg:items-center">
				<div className="bg-white my-4 p-4 rounded-md shadow-lg w-full md:mr-6 md:w-[55%] lg:mr-0 lg:w-full">
					<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
						project details
					</h3>
					<ul className="pb-1 pt-3">
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>cost:</p>
							<p>$1200</p>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>total hours:</p>
							<p>100 hours</p>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>created:</p>
							<p>25 Feb, 2019</p>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>deadline:</p>
							<p>12 Jun, 2019</p>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>Priority:</p>
							<div>
								<Select
									onChange={priority.onChange}
									value={priority.value}
									options={[
										{ title: "High", value: "H" },
										{ title: "Medium", value: "M" },
										{ title: "Low", value: "L" },
									]}
								/>
							</div>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>created by</p>
							<p>barry cuda</p>
						</li>
						<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<p>status:</p>
							<p>working</p>
						</li>
						<li className="rounded-sm flex items-center justify-between capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
							<StatusProgressBar
								background="bg-green-600"
								containerColor="bg-white"
								border="border-none"
								title="Progress"
								result={0.4}
								value="40%"
							/>
						</li>
					</ul>
				</div>

				<div className="bg-white my-4 p-4 rounded-md shadow-lg w-full md:w-[45%] lg:w-full">
					<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
						assigned leaders
					</h3>
					<ul className="pb-1 pt-3">
						<li className="flex items-start rounded-md px-1 py-2 odd:bg-gray-100">
							<div className="w-[15%]">
								<div className="h-[30px] mx-1 w-[30px] rounded-full">
									<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
								</div>
							</div>
							<div className="px-2 w-[85%]">
								<p className="capitalize text-sm text-gray-800 md:text-base">
									william abner
								</p>
								<span className="capitalize text-gray-600 text-xs md:text-sm">
									web developer
								</span>
							</div>
						</li>
						<li className="flex items-start rounded-md px-1 py-2 odd:bg-gray-100">
							<div className="w-[15%]">
								<div className="h-[30px] mx-1 w-[30px] rounded-full">
									<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
								</div>
							</div>
							<div className="px-2 w-[85%]">
								<p className="capitalize text-sm text-gray-800 md:text-base">
									sarah abrams
								</p>
								<span className="capitalize text-gray-600 text-xs md:text-sm">
									web designer
								</span>
							</div>
						</li>
						<li className="flex items-start rounded-md px-1 py-2 odd:bg-gray-100">
							<div className="w-[15%]">
								<div className="h-[30px] mx-1 w-[30px] rounded-full">
									<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
								</div>
							</div>
							<div className="px-2 w-[85%]">
								<p className="capitalize text-sm text-gray-800 md:text-base">
									william kushkin
								</p>
								<span className="capitalize text-gray-600 text-xs md:text-sm">
									content writer
								</span>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div className="bg-white my-4 p-4 rounded-md shadow-lg w-full">
				<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
					Team
				</h3>
				<ul className="grid grid-cols-1 pb-1 pt-3 sm:grid-cols-2 lg:grid-cols-1">
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william abner
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web developer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								sarah abrams
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web designer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william kushkin
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								content writer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william abner
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web developer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								sarah abrams
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web designer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william kushkin
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								content writer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william abner
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web developer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								sarah abrams
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								web designer
							</span>
						</div>
					</li>
					<li className="flex items-start rounded-md px-1 py-2">
						<div className="w-[15%]">
							<div className="h-[30px] mx-1 w-[30px] rounded-full">
								<img className="h-full w-full" src={DEFAULT_IMAGE} alt="" />
							</div>
						</div>
						<div className="px-2 w-[85%]">
							<p className="capitalize text-sm text-gray-800 md:text-base">
								william kushkin
							</p>
							<span className="capitalize text-gray-600 text-xs md:text-sm">
								content writer
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ProjectDetail;
