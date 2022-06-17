import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../config";
import { isErrorWithData, isFormError } from "../store";
import { open as alertModalOpen } from "../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../store/features/modal-slice";
import {
	useGetHolidaysQuery,
	useCreateHolidayMutation,
	useDeleteHolidayMutation,
	useUpdateHolidayMutation,
} from "../store/features/employees-slice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Form, Topbar, HolidayTable } from "../components/Holidays";
import {
	HolidayType,
	HolidayCreateType,
	HolidayErrorType,
} from "../types/employees";
import { Container, Modal } from "../components/common";

const Holidays = () => {
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	const [holidayId, setHolidayId] = useState<string | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [initState, setInitState] = useState<HolidayCreateType>({
		name: "",
		date: "",
	});

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const { data, error, isLoading, isFetching, refetch } = useGetHolidaysQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search,
	});

	const [createHoliday, createData] = useCreateHolidayMutation();
	const [deleteHoliday, deleteData] = useDeleteHolidayMutation();
	const [updateHoliday, updateData] = useUpdateHolidayMutation();

	const apiErrors =
		!editMode && isFormError<HolidayErrorType>(createData.error)
			? createData.error.data
			: editMode && isFormError<HolidayErrorType>(updateData.error)
			? updateData.error.data
			: undefined;

	const apiLoading = !editMode
		? createData.isLoading
		: editMode
		? updateData.isLoading
		: false;

	const handleSubmit = useCallback(
		(form: HolidayCreateType) => {
			if (editMode && holidayId !== null)
				updateHoliday({ id: holidayId, data: form });
			else if (!editMode) createHoliday(form);
		},
		[editMode, createHoliday, updateHoliday, holidayId]
	);

	const handleDelete = useCallback(
		(id: string, data: HolidayCreateType) => {
			dispatch(
				alertModalOpen({
					color: "danger",
					header: `Delete ${data.name} on ${data.date}`,
					message: "Do you want to delete this holiday?",
					decisions: [
						{
							color: "info",
							title: "Cancel",
						},
						{
							onClick: () => deleteHoliday(id),
							color: "danger",
							title: "Proceed",
						},
					],
				})
			);
		},
		[dispatch, deleteHoliday]
	);

	useEffect(() => {
		if (createData.status === "fulfilled") {
			dispatch(modalClose());
			setInitState({ name: "", date: "" });
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
					header: "Holiday Added",
					message: "Holiday was added successfully!",
				})
			);
		} else if (
			createData.status === "rejected" &&
			isErrorWithData(createData.error)
		) {
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
					header: "Failed!",
					message: String(
						createData.error.data.detail ||
							createData.error.data.error ||
							"Failed to add Holiday"
					),
				})
			);
		}
	}, [dispatch, createData.status, createData.error]);

	useEffect(() => {
		if (updateData.status === "fulfilled") {
			dispatch(modalClose());
			setInitState({ name: "", date: "" });
			setEditMode(false);
			setHolidayId(null);
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
					header: "Holiday Updated",
					message: "Holiday was updated successfully!",
				})
			);
		} else if (
			updateData.status === "rejected" &&
			isErrorWithData(updateData.error)
		) {
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
					header: "Failed!",
					message: String(
						updateData.error.data.detail ||
							updateData.error.data.error ||
							"Failed to update Holiday"
					),
				})
			);
		}
	}, [dispatch, updateData.status, updateData.error]);

	useEffect(() => {
		if (deleteData.status === "fulfilled") {
			dispatch(modalClose());
			setInitState({ name: "", date: "" });
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
					header: "Holiday Deleted",
					message: "Holiday was deleted successfully!",
				})
			);
		} else if (
			deleteData.status === "rejected" &&
			isErrorWithData(deleteData.error)
		) {
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
					header: "Failed!",
					message: String(
						deleteData.error.data.detail ||
							deleteData.error.data.error ||
							"Failed to delete Holiday"
					),
				})
			);
		}
	}, [dispatch, deleteData.status, deleteData.error]);

	return (
		<Container
			heading="Holidays"
			refresh={{
				onClick: refetch,
				loading: isFetching,
			}}
			error={
				isErrorWithData(error)
					? {
							statusCode: error?.status,
							title: String(error.data?.error || error.data?.detail || ""),
					  }
					: undefined
			}
			disabledLoading={!isLoading && (isFetching || deleteData.isLoading)}
			loading={isLoading}
			paginate={data ? {
				loading: isFetching,
				offset,
				setOffset,
				totalItems: data.count || 0
			} : undefined}
		>
			<Topbar
				openModal={() => {
					setEditMode(false);
					setInitState({ name: "", date: "" });
					dispatch(modalOpen());
				}}
				loading={isFetching}
				onSubmit={(name: string) => setSearch(name)}
			/>
			<HolidayTable
				holidays={data ? data.results : []}
				onEdit={(id: string, data: HolidayCreateType) => {
					setEditMode(true);
					setHolidayId(id);
					setInitState(data);
					dispatch(modalOpen());
				}}
				onDelete={(id: string, data: HolidayCreateType) =>
					handleDelete(id, data)
				}
			/>
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						editMode={editMode}
						initState={initState}
						errors={apiErrors}
						loading={apiLoading}
						onSubmit={(form: HolidayCreateType) => handleSubmit(form)}
						success={!editMode && createData.status === "fulfilled"}
					/>
				}
				keepVisible={false}
				description={editMode ? "Fill in the form below to edit this holiday" : "Fill in the form below to add a new holiday"}
				title={editMode ? "Edit Holiday" : "Add a holiday"}
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Holidays;
