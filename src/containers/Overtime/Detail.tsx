import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	useGetOvertimeDataQuery,
	useApproveOvertimeMutation,
} from "../../store/features/leaves-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toCapitalize, getDate } from "../../utils";
import { Container, InfoComp, InfoTopBar } from "../../components/common";

const Detail = ({ admin }: { admin?: boolean }) => {
	const { id } = useParams();
	const overtime = useGetOvertimeDataQuery(id || "", {
		skip: typeof id === undefined,
	});
	const [approveOvertime, approve] = useApproveOvertimeMutation();

	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.auth.data);

	const [loading, setLoading] = useState(true);
	const [action, setAction] = useState<"approved" | "denied">("approved");

	useEffect(() => {
		if (overtime.data || overtime.error) setLoading(false);
		const err =
			overtime.error && "status" in overtime.error && overtime.error?.status === 401;
		if (err === true) dispatch(logout());
	}, [dispatch, overtime.data, overtime.error]);

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
							? String(approve?.data)
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
			heading={admin ? "Overtime Information (Admin)" : "Overtime Information"}
			icon
			title={overtime.data?.id}
			error={
				isErrorWithData(overtime.error)
					? {
							statusCode: overtime.error.status,
							title: String(overtime.error.data.error || overtime.error.data.detail || ""),
					  }
					: undefined
			}
			refresh={{
				loading: overtime.isFetching,
				onClick: overtime.refetch,
			}}
			loading={loading}
			disabledLoading={!overtime.isLoading && overtime.isFetching}
		>
			<InfoTopBar
				email={overtime.data?.user?.email}
				full_name={`${overtime.data?.user?.first_name} ${overtime.data?.user?.last_name}`}
				image={overtime.data?.user?.image}
				actions={
					admin && data?.is_admin
						? [
								{
									bg: "bg-green-600 hover:bg-green-500",
									disabled: action === "approved" && approve.isLoading,
									loading: action === "approved" && approve.isLoading,
									onClick: () => {
										if (id) {
											approveOvertime({ id, approval: "approved" });
											setAction("approved");
										}
									},
									title: "Approve Overtime",
								},
								{
									bg: "bg-red-600 hover:bg-red-500",
									disabled: action === "denied" && approve.isLoading,
									loading: action === "denied" && approve.isLoading,
									onClick: () => {
										if (id) {
											approveOvertime({ id, approval: "denied" });
											setAction("denied");
										}
									},
									title: "Deny Overtime",
								},
						  ]
						: undefined
				}
			/>

			<div className="mt-4">
				<InfoComp
					infos={[
						{ title: "First Name", value: overtime.data?.user?.first_name || "" },
						{ title: "Last Name", value: overtime.data?.user?.last_name || "" },
						{ title: "E-mail", value: overtime.data?.user?.email || "" },
						{ title: "Occupation", value: overtime.data?.user?.job ? 
							toCapitalize(overtime.data?.user?.job) : "" },
					]}
					title="employee information"
				/>

				<InfoComp
					infos={[
						{
							title: "Type of Overtime",
							value: overtime.data?.overtime_type?.name ? 
								toCapitalize(overtime.data?.overtime_type?.name) : "Not Specified",
						},
						{
							options: {
								bg: overtime.data?.status
									? overtime.data?.status === "approved"
										? "success"
										: overtime.data.status === "denied"
										? "error"
										: overtime.data.status === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Status",
							value: overtime.data?.status || "Pending",
							type: "badge",
						},
						{
							title: "Date",
							value: overtime.data?.date
								? (getDate(overtime.data.date, true) as string)
								: "",
						},
						{
							title: "Hours",
							value: overtime.data?.hours || "",
						},
						{ title: "Reason For Overtime", value: overtime.data?.reason || "" },
						{
							title: "Date Requested",
							value: overtime.data?.date_requested
								? (getDate(overtime.data.date_requested, true) as string)
								: "",
						},
						{
							title: "Last Update",
							value: overtime.data?.date_updated
								? (getDate(overtime.data.date_updated, true) as string)
								: "",
						},
					]}
					title="overtime information"
					titleWidth="w-[200px]"
				/>

				<InfoComp
					infos={[
						{
							options: {
								bg: overtime.data?.authorized?.supervisor
									? overtime.data?.authorized?.supervisor === "approved"
										? "success"
										: overtime.data?.authorized?.supervisor === "denied"
										? "error"
										: overtime.data?.authorized?.supervisor === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Supervisor",
							value: overtime.data?.authorized?.supervisor || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: overtime.data?.authorized?.hod
									? overtime.data?.authorized?.hod === "approved"
										? "success"
										: overtime.data?.authorized?.hod === "denied"
										? "error"
										: overtime.data?.authorized?.hod === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Head of Department",
							value: overtime.data?.authorized?.hod || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: overtime.data?.authorized?.hr
									? overtime.data?.authorized?.hr === "approved"
										? "success"
										: overtime.data?.authorized?.hr === "denied"
										? "error"
										: overtime.data?.authorized?.hr === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Human Resoure Manager",
							value: overtime.data?.authorized?.hr || "Not Needed",
							type: "badge",
						},
						{
							options: {
								bg: overtime.data?.authorized?.md
									? overtime.data?.authorized?.md === "approved"
										? "success"
										: overtime.data?.authorized?.md === "denied"
										? "error"
										: overtime.data?.authorized?.md === "pending"
										? "warning"
										: "info"
									: "info",
							},
							title: "Managing Director",
							value: overtime.data?.authorized?.md || "Not Needed",
							type: "badge",
						},
					]}
					title="Overtime Status"
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
