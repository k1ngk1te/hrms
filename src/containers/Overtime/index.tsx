import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../config"
import { isErrorWithData, isFormError } from "../../store";
import { logout } from "../../store/features/auth-slice";
import {
	useGetOvertimeQuery,
	useRequestOvertimeMutation,
} from "../../store/features/leaves-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../store/features/modal-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { OvertimeCreateType, OvertimeCreateErrorType } from "../../types/leaves";
import { Container, Modal } from "../../components/common";
import { Cards, Form, Topbar, OvertimeTable } from "../../components/Overtime";


const Overtime = () => {
	const [dateQuery, setDateQuery] = useState({ from: "", to: "" });
	const [offset, setOffset] = useState(0);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const overtime = useGetOvertimeQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		from: dateQuery.from,
		to: dateQuery.to,
	});
	const [requestOvertime, { error, status, isLoading }] = useRequestOvertimeMutation();

	useEffect(() => {
		if (isErrorWithData(error)) {
			if (error?.status === 401) dispatch(logout());
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
						header: "Request Rejected",
						message:
							error.data?.detail || error.data?.error || "Your request for overtime was rejected.",
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
					header: "Request Submitted",
					message: "Your request for overtime was submitted successfully.",
				})
			);
		}
	}, [dispatch, status]);

	const handleSubmit = useCallback((form: OvertimeCreateType) => {
		requestOvertime(form);
	},[requestOvertime]);

	return (
		<Container
			heading="Overtime"
			error={isErrorWithData(overtime.error) ? {
				statusCode: overtime.error.status || 500,
				title: String(overtime.error.data.detail || overtime.error.data.error || "")
			} : undefined}
			refresh={{
				loading: overtime.isFetching,
				onClick: () => {
					setDateQuery({ from: "", to: "" });
					overtime.refetch();
				},
			}}
			disabledLoading={!overtime.isLoading && overtime.isFetching}
			loading={overtime.isLoading}
			paginate={overtime.data ? {
				loading: overtime.isFetching, setOffset, offset,
				totalItems: overtime.data.count
			} : undefined}
		>
			<Cards
				approved={overtime.data?.approved_count || 0}
				denied={overtime.data?.denied_count || 0}
				pending={overtime.data?.pending_count || 0}
			/>
			<Topbar
				loading={overtime.isFetching}
				adminView={false}
				dateSubmit={({ fromDate, toDate }) =>
					setDateQuery({ from: fromDate, to: toDate })
				}
				openModal={() => dispatch(modalOpen())}
			/>
			<OvertimeTable
				overtime={overtime.data?.results || []}
			/>
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						errors={isFormError<OvertimeCreateErrorType>(error) ? error.data : undefined}
						loading={isLoading}
						onSubmit={handleSubmit}
						success={status === "fulfilled"}
					/>
				}
				description="Fill in the form below to request overtime"
				keepVisible
				title="Request Overtime"
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Overtime;
