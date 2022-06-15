import { useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../config";
import { isErrorWithData } from "../store";
import { useGetAttendanceQuery } from "../store/features/employees-slice";
import {
	Activity,
	Statistics,
	AttendanceTable,
	TimeSheet,
} from "../components/Attendance";
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
					<div className="gap-4 grid grid-cols-1 w-full md:gap-5 md:grid-cols-2 lg:grid-cols-3">
						<TimeSheet
							loading={isFetching || false}
							overtime_hours={data.overtime_hours || 0}
							hours_spent={data.hours_spent_today ? data.hours_spent_today.hours : undefined}
							punchedIn={data.hours_spent_today ? data.hours_spent_today.punch_in : undefined}
							punchedOut={data.hours_spent_today ? data.hours_spent_today.punch_out : undefined}
						/>
						<Statistics 
							today={data?.statistics?.today || 0}
							week={data?.statistics?.week || 0}
							month={data?.statistics?.month || 0}
							overtime={data?.statistics?.overtime || 0}
						/>
						<Activity week_hours={data ? data.week_hours : undefined} />
					</div>
					<AttendanceTable
						attendance={data ? data.results : []}
					/>
				</>
			)}
		</Container>
	);
};

export default Attendance;
