import { useState } from "react";
import { isErrorWithData } from "@/store";
import { useGetAttendanceQuery } from "@/store/features/employees-slice";
import { Activity, Statistics, AttendanceTable, TimeSheet } from "@/components/Attendance"
import { Container } from "@/components/common";

const Attendance = () => {
	const [offset, setOffset] = useState(0);
	const {
		data,
		error,
		refetch,
		isLoading,
		isFetching,
	} = useGetAttendanceQuery({ limit: 50, offset });

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
			<div className="gap-4 grid grid-cols-1 w-full md:gap-5 md:grid-cols-2 lg:grid-cols-3">
				<TimeSheet />
				<Statistics />
				<Activity />
			</div>
			<AttendanceTable attendance={data ? data.results : []} loading={isFetching} />
		</Container>
	);
};

export default Attendance;
