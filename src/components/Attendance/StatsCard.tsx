import { useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { isErrorWithData } from "../../store";
import { open } from "../../store/features/alert-slice";
import { useGetAttendanceInfoQuery } from "../../store/features/employees-slice"
import { useAppDispatch } from "../../hooks";
import { Activity, Statistics, TimeSheet } from "./index";

const StatsCard = () => {
	const { data, error, refetch, isFetching } = useGetAttendanceInfoQuery()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isErrorWithData(error)) {
			dispatch(
				open({ 
					type: "danger", 
					message: String(error.data?.detail || error.data?.error || "A server error occurred")
				})
			);
		}
	}, [dispatch, error])

	return (
		<>
			<div className="flex justify-center py-2 w-full">
				<div
					onClick={refetch}
					className="bg-white cursor-pointer duration-500 mx-4 p-2 rounded-full text-gray-700 text-xs transform transition-all hover:bg-gray-200 hover:scale-110 hover:text-gray-600 md:text-sm"
				>
					<BiRefresh className={`${isFetching ? "animate-spin" : ""} text-xs sm:text-sm`} />
				</div>
			</div>
			<div className="gap-4 grid grid-cols-1 w-full md:gap-5 md:grid-cols-2 lg:grid-cols-3">
				<TimeSheet
					loading={isFetching || false}
					overtime_hours={data?.overtime_hours || 0}
					hours_spent={data?.hours_spent_today ? data.hours_spent_today.hours : undefined}
					punchedIn={data?.hours_spent_today ? data.hours_spent_today.punch_in : undefined}
					punchedOut={data?.hours_spent_today ? data.hours_spent_today.punch_out : undefined}
				/>
				<Statistics 
					today={data?.statistics?.today || 0}
					week={data?.statistics?.week || 0}
					month={data?.statistics?.month || 0}
					overtime={data?.statistics?.overtime || 0}
				/>
				<Activity week_hours={data ? data.week_hours : undefined} />
			</div>
		</>
	)
}

export default StatsCard;