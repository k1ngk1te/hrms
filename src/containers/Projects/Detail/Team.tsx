import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa";
import { isErrorWithData } from "../../../store"
import { open as alertModalOpen } from "../../../store/features/alert-modal-slice"
import { open as modalOpen, close as modalClose } from "../../../store/features/modal-slice";
import { useGetProjectQuery } from "../../../store/features/projects-slice"
import { Container, PersonCard } from "../../../components/common";


const Team = () => {
	const {id} = useParams()

	const { data, error, isLoading, isFetching, refetch } = useGetProjectQuery(id || "", {
		skip: id === undefined
	})


	return (
		<Container
			background="bg-gray-100"
			heading="Team Information"
			refresh={{
				loading: isFetching,
				onClick: refetch,
			}}
			error={error && isErrorWithData(error) ? {
				statusCode: error.status || 500,
				title: String(error.data.detail || error.data.error || "")
				} : undefined
			}
			icon
			loading={isLoading}
			title={data ? data.name : undefined}
		>
			{data && (
				<div className="p-2 w-full">
					<div className="py-2 w-full sm:px-4">
						<div className="bg-white p-4 rounded-md shadow-lg">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									{data.name}
								</h3>
							</div>
							<div className="my-1">
								<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
									1{" "}
									<span className="font-bold text-gray-600">open tasks</span>,
								</span>
								<span className="font-medium mr-1 text-gray-800 text-sm md:text-base">
									9{" "}
									<span className="font-bold text-gray-600">
										tasks completed
									</span>
								</span>
							</div>
							<div className="my-1">
								<p className="font-semibold my-2 text-left text-sm text-gray-600 md:text-base">
									{data.description}
								</p>
							</div>
						</div>
						<div className="bg-gray-100 p-4 rounded-md shadow-lg">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Creator
								</h3>
							</div>
							<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-3">
								<PersonCard />								
							</div>
						</div>
						<div className="bg-gray-100 p-4 rounded-md shadow-lg">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Leaders
								</h3>
							</div>
							<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-3">
								<PersonCard />								
								<PersonCard />								
							</div>
						</div>
						<div className="bg-gray-100 p-4 rounded-md shadow-lg">
							<div className="my-2">
								<h3 className="capitalize cursor-pointer font-bold text-lg text-gray-800 tracking-wide md:text-xl">
									Project Team
								</h3>
							</div>
							<div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-3">
								<PersonCard />								
								<PersonCard />								
								<PersonCard />								
								<PersonCard />								
								<PersonCard />								
							</div>
						</div>
					</div>
				</div>
			)}
		</Container>
	)
}

export default Team