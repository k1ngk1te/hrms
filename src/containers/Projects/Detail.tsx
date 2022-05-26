import { useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaCheckCircle, FaTimes, FaCheck, FaEye, FaPen, FaFileUpload, FaTrash, FaRegFilePdf } from "react-icons/fa";
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

const Tasks = () => (
	<ul>
		<Task done={false} />
		<Task done={false} />
		<Task done={false} />
		<Task done />
		<Task done={false} />
		<Task done />
	</ul>
)

const Detail = () => {
	const { id } = useParams()
	const { data, error, refetch, isLoading, isFetching } = useGetProjectQuery(id || "", {
		skip: id === undefined
	})

	const priority = useFormSelect("H")

	const screens = [
		{title: "all tasks", component: <Tasks />},
		{title: "pending tasks", component: <Tasks />},
		{title: "completed tasks", component: <Tasks />},
	]

	return (
		<Container
			background="bg-gray-100"
			heading="Project Information"
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
		>
			<div className="p-2">
				<div className="flex justify-end w-full sm:px-4">
					<div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
						<Button
							IconLeft={FaPen}
							rounded="rounded-xl"
							title="edit project"
						/>
					</div>
				</div>
				<div className="flex flex-col items-center lg:flex-row lg:items-start">
					<div className="py-2 w-full sm:px-4 lg:w-2/3">
						<div className="bg-white p-4 rounded-md shadow-lg">
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
							<div className="my-1">
								<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
									Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ... Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut sunt veniam autem hic dicta obcaecati fugiat, assumenda ratione impedit t ...
								</p>
							</div>
						</div>

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
							<div className="gap-4 grid grid-cols-2 p-3 md:gap-5 md:grid-cols-3 lg:gap-6">
								<div>
									<div className="bg-gray-500 h-[100px] rounded-md w-full md:h-[120px] lg:h-[100px]">
										<img
											className="h-full rounded-md w-full"
											src="/static/images/bg.png"
											alt=""
										/>
									</div>
									<p className="my-1 text-left text-sm text-gray-700 md:text-base">
										demo.png
									</p>
								</div>
								<div>
									<div className="bg-gray-500 h-[100px] rounded-md w-full md:h-[120px] lg:h-[100px]">
										<img
											className="h-full rounded-md w-full"
											src="/static/images/bg.png"
											alt=""
										/>
									</div>
									<p className="my-1 text-left text-sm text-gray-700 md:text-base">
										demo.png
									</p>
								</div>
								<div>
									<div className="bg-gray-500 h-[100px] rounded-md w-full md:h-[120px] lg:h-[100px]">
										<img
											className="h-full rounded-md w-full"
											src="/static/images/bg.png"
											alt=""
										/>
									</div>
									<p className="my-1 text-left text-sm text-gray-700 md:text-base">
										demo.png
									</p>
								</div>
								<div>
									<div className="bg-gray-500 h-[100px] rounded-md w-full md:h-[120px] lg:h-[100px]">
										<img
											className="h-full rounded-md w-full"
											src="/static/images/bg.png"
											alt=""
										/>
									</div>
									<p className="my-1 text-left text-sm text-gray-700 md:text-base">
										demo.png
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white my-4 p-4 rounded-md shadow-lg">
							<h3
								className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
							>
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
											<FaRegFilePdf
												className="text-xl text-gray-700 md:text-2xl"
											/>
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
											<FaRegFilePdf
												className="text-xl text-gray-700 md:text-2xl"
											/>
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

						<div className="bg-white my-4 p-4 rounded-md shadow-lg">
							<TabNavigator container="" screens={screens} />
						</div>

					</div>



					<div className="py-2 w-full sm:px-4 lg:w-1/3">

						<div className="flex flex-col items-center md:flex-row md:items-start lg:flex-col lg:items-center">

							<div className="bg-white my-4 p-4 rounded-md shadow-lg w-full md:mr-6 md:w-[55%] lg:mr-0 lg:w-full">

								<h3
									className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
								>
									project details
								</h3>
								<ul className="pb-1 pt-3">
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											cost:
										</p>
										<p>
											$1200
										</p>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											total hours:
										</p>
										<p>
											100 hours
										</p>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											created:
										</p>
										<p>
											25 Feb, 2019
										</p>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											deadline:
										</p>
										<p>
											12 Jun, 2019
										</p>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											Priority:
										</p>
										<div>
											<Select onChange={priority.onChange} value={priority.value} options={[{title: "High", value: "H"}, {title: "Medium", value: "M"}, {title: "Low", value: "L"}]} />
										</div>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											created by
										</p>
										<p>
											barry cuda
										</p>
									</li>
									<li className="odd:bg-gray-100 rounded-sm flex items-center justify-between p-2 capitalize font-medium text-gray-800 text-base md:text-lg lg:text-base">
										<p>
											status:
										</p>
										<p>
											working
										</p>
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

								<h3
									className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
								>
									assigned leaders
								</h3>
								<ul className="pb-1 pt-3">
									<li className="flex items-start rounded-md px-1 py-2 odd:bg-gray-100">
										<div className="w-[15%]">
											<div className="h-[30px] mx-1 w-[30px] rounded-full">
												<img
													className="h-full w-full"
													src={DEFAULT_IMAGE}
													alt=""
												/>
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
												<img
													className="h-full w-full"
													src={DEFAULT_IMAGE}
													alt=""
												/>
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
												<img
													className="h-full w-full"
													src={DEFAULT_IMAGE}
													alt=""
												/>
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

							<h3
								className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl"
							>
								Team
							</h3>
							<ul className="grid grid-cols-1 pb-1 pt-3 sm:grid-cols-2 lg:grid-cols-1">
								<li className="flex items-start rounded-md px-1 py-2">
									<div className="w-[15%]">
										<div className="h-[30px] mx-1 w-[30px] rounded-full">
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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
											<img
												className="h-full w-full"
												src={DEFAULT_IMAGE}
												alt=""
											/>
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


				</div>
			</div>
		</Container>
	)
}

export default Detail;