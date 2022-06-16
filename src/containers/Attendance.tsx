import { useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../config";
import { isErrorWithData } from "../store";
import { useGetAttendanceQuery } from "../store/features/employees-slice";
import { StatsCard, AttendanceTable } from "../components/Attendance";
import { Container } from "../components/common";

const Attendance = () => {
	const [offset, setOffset] = useState(0);
	const {
		data,
		error,
		refetch,
		isLoading,
		isFetching,
	} = useGetAttendanceQuery({ limit: DEFAULT_PAGINATION_SIZE, offset });

	return (
		<Container
			background="bg-gray-100"
			heading="Attendance"
			refresh={{
				onClick: refetch,
				loading: isFetching,
			}}
			error={
				isErrorWithData(error)
					? {
							statusCode: error.status,
							title: String(error.data.detail || error.data.error || ""),
					  }
					: undefined
			}
			disabledLoading={!isLoading && isFetching}
			loading={isLoading}
			paginate={
				data
					? {
							loading: isFetching,
							offset,
							setOffset,
							totalItems: data ? data.count : 0,
					  }
					: undefined
			}
		>
			{data && (
				<>
					<StatsCard />
					<AttendanceTable
						attendance={data ? data.results : []}
					/>
				</>
			)}
		</Container>
	);
};

export default Attendance;
