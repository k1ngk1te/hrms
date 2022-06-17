import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE, OVERTIME_ADMIN_EXPORT_URL } from "../../../config";
import { isErrorWithData, isFormError } from "../../../store";
import { logout } from "../../../store/features/auth-slice";
import {
	useGetAdminOvertimeQuery,
	useCreateOvertimeMutation,
} from "../../../store/features/leaves-slice";
import { open as alertModalOpen } from "../../../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../../store/features/modal-slice";
import { downloadFile } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { OvertimeCreateType, OvertimeCreateErrorType } from "../../../types/leaves";
import OvertimeTable from "../../../components/Overtime/Admin/Table";
import { Container, Modal } from "../../../components/common";
import { Form, Topbar, Cards } from "../../../components/Overtime";


const Overtime = () => {
	const [offset, setOffset] = useState(0);
	const [dateQuery, setDateQuery] = useState({ from: "", to: "" });
	const [nameSearch, setNameSearch] = useState("");
	const [_status, setStatus] = useState<"" | "approved" | "denied" | "pending">(
		""
	);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const overtime = useGetAdminOvertimeQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search: nameSearch,
		from: dateQuery.from,
		to: dateQuery.to,
	});
	const [createOvertime, { error, status, isLoading }] = useCreateOvertimeMutation();


	useEffect(() => {
		if (isErrorWithData(error)) {
			if (error.status === 401) dispatch(logout());
			else if (error.data?.error || error.data?.detail) {
				dispatch(
					alertModalOpen({
						color: "danger",
						decisions: [
							{
								color: "danger",
								title: "OK",
							},
						],
						Icon: FaTimesCircle,
						header: "Overtime Creation Failed",
						message:
							String(error.data?.error || error.data?.detail ||
							"Your request to create an overtime was rejected."),
					})
				);
			}
		}
	}, [dispatch, error]);

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(modalClose());
			dispatch(
				alertModalOpen({
					color: "success",
					decisions: [
						{
							color: "success",
							title: "OK",
						},
					],
					Icon: FaCheckCircle,
					header: "Overtime Created",
					message: "Overtime created successfully.",
				})
			);
		}
	}, [dispatch, status]);

	const handleSubmit = useCallback((form: OvertimeCreateType) => {
		createOvertime(form);
	},[createOvertime]);

	const exportLeave = useCallback(
		async (type: "csv" | "excel", filter: boolean) => {
			const url = `${OVERTIME_ADMIN_EXPORT_URL(type)}${
				filter
					? `?name=${nameSearch}&status=${_status}&from=${dateQuery.from}&to=${dateQuery.to}`
					: ""
			}`;
			const response = await downloadFile(
				url,
				type === "csv" ? "overtime.csv" : "overtime.xls"
			);

			if (response?.status === 401) dispatch(logout());
			else if (response?.status !== 401 && response?.status !== 200)
				dispatch(
					alertModalOpen({
						color: "danger",
						Icon: FaTimesCircle,
						header: "Export Failed",
						message: "Failed to export data!",
					})
				);
		},
		[dispatch, dateQuery.from, dateQuery.to, nameSearch, _status]
	);

	return (
		<Container
			heading="Employee Overtime"
			error={isErrorWithData(overtime.error) ? {
				statusCode: overtime.error.status || 500,
				title: String(overtime.error.data?.detail || overtime.error.data?.error || "")
			} : undefined}
			refresh={{
				loading: overtime.isFetching,
				onClick: () => {
					setDateQuery({ from: "", to: "" });
					setNameSearch("");
					overtime?.refetch();
				},
			}}
			disabledLoading={!overtime.isLoading && overtime.isFetching}
			loading={overtime.isLoading}
			paginate={overtime.data ? {
				offset, setOffset, loading: overtime.isFetching, totalItems: overtime.data.count
			} : undefined}
		>
			<Cards
				approved={overtime.data?.approved_count || 0}
				denied={overtime.data?.denied_count || 0}
				pending={overtime.data?.pending_count || 0}
			/>
			<Topbar
				adminView
				openModal={() => dispatch(modalOpen())}
				loading={overtime.isFetching}
				dateSubmit={({ fromDate, toDate }) =>
					setDateQuery({ from: fromDate, to: toDate })
				}
				searchSubmit={(search: string) => setNameSearch(search)}
				exportData={exportLeave}
			/>
			<OvertimeTable
				setStatus={setStatus}
				overtime={overtime.data?.results || []}
			/>
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						adminView
						errors={isFormError<OvertimeCreateErrorType>(error) ? error.data : undefined}
						loading={isLoading}
						onSubmit={handleSubmit}
						success={status === "fulfilled"}
					/>
				}
				description="Fill in the form below to add overtime"
				keepVisible
				title="Add Overtime"
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Overtime;
