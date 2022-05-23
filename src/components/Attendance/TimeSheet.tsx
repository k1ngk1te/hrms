import { FC, useCallback, useEffect, useState } from "react";
import { isErrorWithData } from "@/store";
import { open } from "@/store/features/alert-slice";
import { open as alertModalOpen } from "@/store/features/alert-modal-slice";
import { usePunchActionMutation } from "@/store/features/employees-slice";
import { useAppDispatch } from "@/hooks";
import { Button, Loader } from "@/components/controls";
import { getTime } from "@/utils";

export type TimeSheetProps = {
	loading: boolean;
	punchedIn?: string;
	punchedOut?: string;
};

const TimeSheet: FC<TimeSheetProps> = ({ loading, punchedIn, punchedOut }) => {
	const dispatch = useAppDispatch();

	const [punchAction, { data, error, status, isLoading }] = usePunchActionMutation();

	const handlePunchOut = useCallback(() => {
		dispatch(
			alertModalOpen({
				color: "warning",
				header: "Punch out?",
				message: "Do you wish to continue?",
				decisions: [
					{
						color: "info",
						title: "Cancel",
					},
					{
						onClick: () => punchAction("out"),
						color: "warning",
						title: "Proceed",
					},
				],
			})
		);
	}, [dispatch, punchAction]);

	const able = typeof punchedIn  === "string" && typeof punchedOut === "string" ? false : true

	useEffect(() => {
		if (status === "fulfilled" && data)
			dispatch(open({ type: "success", message: data.detail || "Your request was successful" }));
		else if (status === "rejected" && isErrorWithData(error))
			dispatch(
				open({
					type: "danger",
					message: String(
						error.data.detail ||
							error.data.error ||
							"Unable to punch in, please try again later!"
					),
				})
			);
	}, [dispatch, data, status, error]);

	return (
		<div className="bg-white px-4 py-2 rounded-lg shadow-lg">
			<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider sm:text-center md:text-left md:text-xl">
				timesheet
			</h3>
			<div className="bg-gray-100 border border-gray-300 max-w-xs mx-auto my-1 px-3 py-2 rounded-lg">
				<span className="font-semibold my-3 inline-block text-gray-900 text-sm lg:my-1">
					Punch In at
				</span>
				<p className="capitalize text-gray-500 tracking-wide text-lg md:text-base">
					{punchedIn ? `${new Date().toDateString()} ${getTime(punchedIn)}` : "------------"}
				</p>
			</div>
			<div className="flex justify-center items-center my-4 lg:my-3">
				<div className="border-4 border-gray-300 flex h-28 items-center justify-center rounded-full w-28">
					{(loading || isLoading) ? <Loader type="dotted" color="primary" size={4} /> : (
						<span className="font-semibold text-center text-gray-800 text-2xl md:text-3xl lg:text-2xl">
							{punchedIn ? punchedIn : 0} hrs
						</span>
					)}
				</div>
			</div>
			<div className="flex justify-center items-center my-1">
				<div>
					<Button
						bg={`${punchedIn ? "bg-secondary-500 hover:bg-secondary-600 focus:ring-secondary-300" : "bg-primary-500 hover:bg-primary-600 focus:ring-primary-300"} group focus:outline-none focus:ring-2 focus:ring-offset-2"`}
						caps
						disabled={loading || isLoading || able === false}
						loader
						loading={loading || isLoading}
						padding="px-4 py-2 md:px-6 md:py-3 lg:px-4 lg:py-2"
						rounded="rounded-xl"
						onClick={able ? punchedIn ? handlePunchOut : () => punchAction("in") : undefined}
						title={able === false ? "Punched Out" : punchedIn ? "Punch Out" : "Punch In"}
						titleSize="text-base sm:tracking-wider md:text-lg"
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 my-3 pt-2 lg:my-1">
				<div className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-center w-full">
					<span className="font-semibold my-1 inline-block text-gray-900 text-sm">
						Break
					</span>
					<p className="capitalize text-gray-500 tracking-wide text-base">
						1.21 hrs
					</p>
				</div>
				<div className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-center w-full">
					<span className="font-semibold my-1 inline-block text-gray-900 text-sm">
						Overtime
					</span>
					<p className="capitalize text-gray-500 tracking-wide text-base">
						3 hrs
					</p>
				</div>
			</div>
		</div>
	);
};

export default TimeSheet;
