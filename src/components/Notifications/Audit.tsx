import { FC, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useDeleteNotificationMutation } from "../../store/features/notifications-slice";
import { useAppDispatch } from "../../hooks";
import { Button } from "../controls";

const weekdays = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

type AuditType = {
	id: number | string;
	date_sent: string;
	goto?: string;
	message: string;
	read: boolean;
};

const Audit: FC<AuditType> = ({ id, date_sent, goto, read, message }) => {
	const [deleteNote, { status, isLoading }] = useDeleteNotificationMutation();
	const dispatch = useAppDispatch();

	const date = new Date(date_sent);

	const day = weekdays[date.getDay()];
	const month = date.toLocaleString("default", { month: "short" });

	const minutes = date.getMinutes();
	const hours = date.getHours();
	const _hour = hours > 12 ? hours - 12 : hours;
	const AM_PM = hours > 12 ? "PM" : "AM";

	useEffect(() => {
		if (status === "fulfilled" || status === "rejected") {
			dispatch(
				alertModalOpen({
					color: status === "fulfilled" ? "success" : "danger",
					decisions: [
						{
							color: status === "fulfilled" ? "success" : "danger",
							title: "OK",
						},
					],
					Icon: status === "fulfilled" ? FaCheckCircle : FaTimesCircle,
					header:
						status === "fulfilled"
							? "Notification Deleted"
							: "Failed to Delete",
					message:
						status === "fulfilled"
							? "Notification Deleted Successfully"
							: "Failed to Delete Notification",
				})
			);
		}
	}, [dispatch, status]);

	return (
		<div
			className={`${
				read ? "border-green-600" : "border-red-600"
			} bg-white border-2 border-[ridge] flex items-start mb-3 p-2 rounded-md shadow-lg`}
		>
			<div className="flex flex-col items-center h-full">
				<div
					className={`${
						read ? "border-green-600" : "border-red-600"
					} border-2 h-[0.6rem] m-1 rounded-full w-[0.6rem]`}
				/>
			</div>
			<div className="flex flex-col mx-2 w-full md:flex-row md:justify-between">
				<div>
					<h6 className="capitalize font-medium mb-1 text-gray-400 text-xs md:text-sm">
						{`${day} ${date.getDate()} ${month} ${date.getFullYear()}`}
					</h6>
					<span className="font-semibold my-1 text-gray-400 text-xs uppercase">
						{`${_hour}:${minutes} ${AM_PM}`}
					</span>
					<p className="font-medium my-1 text-gray-500 text-xs md:text-sm">
						{message}
					</p>
				</div>
				<div className="flex items-center mt-2 md:mt-0">
					{goto && (
						<div className="mr-2 sm:mr-3 md:mx-4">
							<Button
								bg={`${
									read
										? "bg-green-500 hover:bg-green-600"
										: "bg-yellow-500 hover:bg-yellow-300"
								}`}
								bold="normal"
								caps
								link={goto}
								title="View"
							/>
						</div>
					)}
					<div className="mx-2 sm:mx-3 md:mx-4">
						<Button
							bg="bg-red-500 hover:bg-red-600"
							bold="normal"
							caps
							disabled={isLoading}
							onClick={() => deleteNote(id)}
							title="Delete"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Audit;
