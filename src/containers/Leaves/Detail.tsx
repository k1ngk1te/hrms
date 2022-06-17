import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	useGetLeaveQuery,
	useApproveLeaveMutation,
} from "../../store/features/leaves-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getDate } from "../../utils";
import { Container, InfoComp, InfoTopBar } from "../../components/common";

const Detail = ({ admin }: { admin?: boolean }) => {
	const { id } = useParams();
	const leave = useGetLeaveQuery(id || "", {
		skip: typeof id === undefined,
	});
	const [approveLeave, approve] = useApproveLeaveMutation();

	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.auth.data);

	const [loading, setLoading] = useState(true);
	const [action, setAction] = useState<"approved" | "denied">("approved");

	useEffect(() => {
		if (leave.data || leave.error) setLoading(false);
		const err =
			leave.error && "status" in leave.error && leave.error?.status === 401;
		if (err === true) dispatch(logout());
	}, [dispatch, leave.data, leave.error]);

	useEffect(() => {
		if (approve.status === "fulfilled" || approve.status === "rejected") {
			const status = approve.status === "fulfilled" ? true : false;
			dispatch(
				alertModalOpen({
					color: !status
						? "danger"
						: action === "approved"
						? "success"
						: "warning",
					header: !status
						? "Forbidden"
						: action === "approved"
						? "Approved"
						: "Denied",
					message:
						!status && isErrorWithData(approve.error)
							? approve.error.data?.error || approve.error.data?.detail
								? String(
										approve?.error?.data.error || approve.error.data?.detail
								  )
								: "Something went wrong!"
							: approve.data
							? String(approve?.data?.detail || "Action successful!")
							: "Request Completed",
				})
			);
			if (approve.status === "rejected") {
				const err =
					approve.error &&
					"status" in approve.error &&
					approve.error?.status === 401;
				if (err === true) dispatch(logout());
			}
		}
	}, [action, approve, dispatch]);

	return (
		<Container
			heading={admin ? "Leave Information (Admin)" : "Leave Information"}
			icon
			title={leave.data?.id}
			error={
				isErrorWithData(leave.error)
					? {
							statusCode: leave.error.status,
							title: String(leave.error.data.error || leave.error.data.detail || ""),
					  }
					: undefined
			}
			refresh={{
				loading: leave.isFetching,
				onClick: leave.refetch,
			}}
			loading={loading}
			disabledLoading={!leave.isLoading && leave.isFetching}
		>
			<InfoTopBar
				email={leave.data?.user?.email}
				full_name={`${leave.data?.user?.first_name} ${leave.data?.user?.last_name}`}
				image={leave.data?.user?.image}
				actions={
					admin && data?.is_admin
						? [
								{
									bg: "bg-green-600 hover:bg-green-500",
									disabled: action === "approved" && approve.isLoading,
									loading: action === "approved" && approve.isLoading,
									onClick: () => {
										if (id) {
											approveLeave({ id, approval: "approved" });
											setAction("approved");
										}
									},
									title: "Approve Leave",
								},
								{
									bg: "bg-red-600 hover:bg-red-500",
									disabled: action === "denied" && approve.isLoading,
									loading: action === "denied" && approve.isLoading,
									onClick: () => {
										if (id) {
											approveLeave({ id, approval: "denied" });
											setAction("denied");
										}
									},
									title: "Deny Leave",
								},
						  ]
						: undefined
				}
			/>

			<div className="mt-4">
				<InfoComp
					infos={[
						{ title: "First Name", value: leave.data?.user?.first_name || "" },
						{ title: "Last Name", value: leave.data?.user?.last_name || "" },
						{ title: "E-mail", value: leave.data?.user?.email || "" },
						{ title: "Occupation", value: leave.data?.user?.job || "" },
					]}
					title="employee information"
				/>

				<InfoComp
					infos={[
						{
							title: "Type of Leave",
							value: leave.data?.leave_type?.name || "Not Specified",
						},
						{
							options: {
								bg: leave.data?.status
									? leave.data?.status === "approved"
										? "success"
										: leave.data.status === "denied"
										? "error"
										: leave.data.status === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Status",
							value: leave.data?.status || "Pending",
							type: "badge",
						},
						{
							title: "Start Date",
							value: leave.data?.start_date
								? (getDate(leave.data.start_date, true) as string)
								: "",
						},
						{
							title: "End Date",
							value: leave.data?.end_date
								? (getDate(leave.data.end_date, true) as string)
								: "",
						},
						{
							title: "Resumption Date",
							value: leave.data?.resume_date
								? (getDate(leave.data.resume_date, true) as string)
								: "",
						},
						{
							title: "Number Of Days",
							value: String(leave.data?.no_of_days),
						},
						{ title: "Reason For Leave", value: leave.data?.reason || "" },
						{
							title: "Date Requested",
							value: leave.data?.date_requested
								? (getDate(leave.data.date_requested, true) as string)
								: "",
						},
						{
							title: "Last Update",
							value: leave.data?.date_updated
								? (getDate(leave.data.date_updated, true) as string)
								: "",
						},
					]}
					title="leave information"
					titleWidth="w-[200px]"
				/>

				<InfoComp
					infos={[
						{
							options: {
								bg: leave.data?.authorized?.supervisor
									? leave.data?.authorized?.supervisor === "approved"
										? "success"
										: leave.data?.authorized?.supervisor === "denied"
										? "error"
										: leave.data?.authorized?.supervisor === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Supervisor",
							value: leave.data?.authorized?.supervisor || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: leave.data?.authorized?.hod
									? leave.data?.authorized?.hod === "approved"
										? "success"
										: leave.data?.authorized?.hod === "denied"
										? "error"
										: leave.data?.authorized?.hod === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Head of Department",
							value: leave.data?.authorized?.hod || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: leave.data?.authorized?.hr
									? leave.data?.authorized?.hr === "approved"
										? "success"
										: leave.data?.authorized?.hr === "denied"
										? "error"
										: leave.data?.authorized?.hr === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Human Resoure Manager",
							value: leave.data?.authorized?.hr || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: leave.data?.authorized?.md
									? leave.data?.authorized?.md === "approved"
										? "success"
										: leave.data?.authorized?.md === "denied"
										? "error"
										: leave.data?.authorized?.md === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Managing Director",
							value: leave.data?.authorized?.md || "Not Needed",
							type: "badge",
						},
					]}
					title="Leave Status"
					titleWidth="w-[210px]"
				/>
			</div>
		</Container>
	);
};

Detail.defaultProps = {
	admin: false,
};

export default Detail;
