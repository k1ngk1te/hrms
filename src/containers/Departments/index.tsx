import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaSearch, FaPlus, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { isErrorWithData, isFormError } from "../../store";
import { logout } from "../../store/features/auth-slice";
import {
	useGetDepartmentsQuery,
	useCreateDepartmentMutation,
	useUpdateDepartmentMutation,
	useDeleteDepartmentMutation,
} from "../../store/features/departments-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../store/features/modal-slice";
import { useAppDispatch, useAppSelector, useFormInput } from "../../hooks";
import { Form, DepartmentTable } from "../../components/Departments";
import { Container, Modal } from "../../components/common";
import { Button, InputButton } from "../../components/controls";
import { DepartmentCreateType } from "../../types"

const Departments = () => {
	const [editMode, setEditMode] = useState(false);
	const [depId, setDepId] = useState<string | undefined>(undefined);
	const [offset, setOffset] = useState(0);
	const [nameSearch, setNameSearch] = useState("");

	const search = useFormInput("");

	const dispatch = useAppDispatch();
	const authData = useAppSelector((state) => state.auth.data);
	const modalVisible = useAppSelector((state) => state.modal.visible);
	const departments = useGetDepartmentsQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search: nameSearch,
	});

	const [
		createDepartment,
		{ error, status, isLoading },
	] = useCreateDepartmentMutation();
	const [updateDepartment, update] = useUpdateDepartmentMutation();
	const [deleteDepartment, deleteData] = useDeleteDepartmentMutation();
	const [initState, setInitState] = useState({ name: "", hod: "" });

	useEffect(() => {
		if (search.value === "") setNameSearch("");
	}, [search.value]);

	useEffect(() => {
		const e2 =
			isErrorWithData(departments.error) && departments.error?.status === 401;
		const e3 =
			isErrorWithData(deleteData.error) && deleteData.error?.status === 401;
		const e4 = isErrorWithData(update.error) && update.error?.status === 401;

		if (e2 === true || e3 === true || e4 === true) dispatch(logout());
	}, [dispatch, departments.error, update.error, deleteData.error]);

	useEffect(() => {
		if (isErrorWithData(error)) {
			if (error.status === 401) dispatch(logout());
			else if (error?.data?.error?.error) {
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
						header: "Department Creation Failed",
						message:
							error?.data?.error || "Failed to create new department.",
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
					header: "Department Created",
					message: "Department Created Successfully.",
				})
			);
		}
	}, [dispatch, status]);

	useEffect(() => {
		if (update.status === "fulfilled") {
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
					header: "Department Updated",
					message: "Department Updated Successfully.",
				})
			);
		}
	}, [dispatch, update.status]);

	useEffect(() => {
		if (deleteData.status === "fulfilled") {
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
					header: "Department Deleted",
					message: "Department Deleted Successfully.",
				})
			);
		}
	}, [dispatch, deleteData.status]);

	const handleSubmit = useCallback(
		(form: { name: string; hod?: string }) => {
			const data: DepartmentCreateType = { name: form.name.toLowerCase()}
			if (form.hod) data["hod"] = { id: form.hod }

			if (editMode && depId) updateDepartment({
						data,
						id: depId,
				  })
			else createDepartment(data);
		},
		[createDepartment, depId, editMode, updateDepartment]
	);

	const handleDelete = useCallback(
		(id: string) => {
			dispatch(
				alertModalOpen({
					color: "warning",
					decisions: [
						{
							color: "danger",
							onClick: () => deleteDepartment(id),
							title: "Confirm",
						},
						{
							color: "info",
							title: "Cancel",
						},
					],
					Icon: FaCheckCircle,
					header: "Delete Department?",
					message: "Do you want to delete this Department?.",
				})
			);
		},
		[dispatch, deleteDepartment]
	);

	return (
		<Container
			heading="departments"
			refresh={{
				loading: departments.isFetching,
				onClick: () => departments.refetch(),
			}}
			error={isErrorWithData(departments.error) ? {
				statusCode: departments.error.status || 500,
				title: String(departments.error.data?.detail || departments.error.data?.error || "")
			} : undefined}
			disabledLoading={!departments.isLoading && departments.isFetching}
			loading={departments.isLoading}
			paginate={departments.data ? {
				loading: departments.isFetching,
				setOffset, offset, totalItems: departments.data.count || 0
			} : undefined}
		>
			<div className="flex flex-col md:flex-row md:items-center md:px-2 lg:px-4">
				<form
					className="flex items-center mb-3 pr-8 w-full lg:mb-0"
					onSubmit={(e) => {
						e.preventDefault();
						setNameSearch(search.value.toLowerCase());
					}}
				>
					<InputButton
						buttonProps={{
							disabled: departments.isFetching,
							title: "Search",
							type: "submit",
						}}
						inputProps={{
							bdrColor: "border-primary-500",
							Icon: FaSearch,
							onChange: search.onChange,
							placeholder: "Search Departments",
							rounded: "rounded-l-lg",
							value: search.value,
						}}
					/>
				</form>
				{(authData?.admin_status === "hr" ||
					authData?.admin_status === "md") && (
					<div className="flex justify-end px-2 w-full">
						<div className="w-3/4 lg:w-1/2">
							<Button
								caps
								IconRight={FaPlus}
								onClick={() => {
									setInitState({ name: "", hod: "" });
									setEditMode(false);
									dispatch(modalOpen());
								}}
								rounded="rounded-xl"
								title="Add department"
							/>
						</div>
					</div>
				)}
			</div>
			<div className="w-full">
				<DepartmentTable
					departments={departments.data?.results || []}
					updateDep={(data: {
						id: string;
						name: string;
						hod: string;
					}) => {
						setDepId(data.id);
						setInitState({ name: data.name, hod: data.hod });
						setEditMode(true);
						dispatch(modalOpen());
					}}
					deleteDep={(id: string) => handleDelete(id)}
					disableAction={departments.isFetching}
				/>
			</div>
			<Modal
				component={
					<Form
						initState={initState}
						errors={
							editMode
								? isFormError<{
									name?: string;
									hod?: {
										id: string;
									}
								}>(update.error) ? update.error?.data : undefined
								: isFormError<{
									name?: string;
									hod?: {
										id: string;
									}
								}>(error) ? error?.data : undefined
						}
						editMode={editMode}
						loading={editMode ? update.isLoading : isLoading}
						success={editMode === false && status === "fulfilled"}
						onSubmit={handleSubmit}
					/>
				}
				close={() => dispatch(modalClose())}
				description="Fill in the form below to add a new department"
				title="Add New Department"
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Departments;
