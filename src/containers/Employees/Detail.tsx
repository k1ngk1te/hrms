import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaUserEdit, FaUserCheck, FaUserSlash, FaTrash } from "react-icons/fa";
import {DEFAULT_IMAGE} from "../../config"
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { useGetEmployeeQuery, useDeleteEmployeeMutation } from "../../store/features/employees-slice";
import { open as alertOpen } from "../../store/features/alert-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	open as modalOpen,
	close as modalClose,
} from "../../store/features/modal-slice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useDeactivateEmployee } from "../../hooks/employees";
import { getDate, toCapitalize } from "../../utils";
import { ChangePasswordForm, EmployeeForm } from "../../components/Employees";
import { Container, InfoComp, InfoTopBar, Modal } from "../../components/common";

const Employee = () => {
	const { id } = useParams();
	const { data, error, isLoading, isFetching, refetch } = useGetEmployeeQuery(
		id || "",
		{
			skip: id === undefined,
		}
	);

	const navigate = useNavigate()

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);
	const authData = useAppSelector((state) => state.auth.data);
	const admin_status = authData?.admin_status;
	const userActive = data?.active;

	const [formType, setFormType] = useState<"employee" | "password">("employee");

	const [deleteEmployee, deleteData] = useDeleteEmployeeMutation()

	const { deactivate, loading } = useDeactivateEmployee();

	const handleDeleteEmployee = useCallback((id: string) => {
		dispatch(alertModalOpen({
			header: "Delete Employee?",
			color: "warning",
			message: "Do you want to delete employee?",
			decisions: [
				{
					bg: "bg-gray-600 hover:bg-gray-500",
					caps: true,
					onClick: () => {},
					title: "cancel"
				},
				{
					bg: "bg-red-600 hover:bg-red-500",
					caps: true,
					onClick: () => deleteEmployee(id),
					title: "proceed"
				},
			]
		}))
	}, [dispatch, deleteEmployee])

	useEffect(() => {
		const error = deleteData.error;
		if (isErrorWithData(error)) {
			if (error?.status) dispatch(logout())
			else {
				dispatch(alertModalOpen({
					header: "Failed to Delete",
					color: "danger",
					message: String(error.data?.detail || error.data?.error || "A server error occurred!")
				}))
			}
		}
	}, [dispatch, deleteData.error])

	useEffect(() => {
		if (deleteData.isSuccess === true) {
			dispatch(alertOpen({ type: "success", message: "Employee was deleted successfully!" }));
			navigate(-1)
		}
	}, [dispatch, deleteData.isSuccess, navigate])

	useEffect(() => {
		if (isErrorWithData(error) && error?.status === 401) dispatch(logout());
	}, [dispatch, error]);

	return (
		<Container
			heading="Employee Information"
			icon
			refresh={{
				loading: isFetching,
				onClick: () => refetch(),
			}}
			loading={isLoading}
			disabledLoading={!isLoading && isFetching}
			error={
				error && isErrorWithData(error)
					? {
							statusCode: error.status,
							title: error.data.detail || error.data.error,
					  }
					: undefined
			}
			title={data && data.user?.full_name ? data.user.full_name : undefined}
		>
			{data && (
				<>
					<InfoTopBar
						email={data?.user.email}
						full_name={data ? toCapitalize(data.user.full_name) : ""}
						image={data?.profile?.image || DEFAULT_IMAGE}
						actions={
							admin_status === "hr" || admin_status === "md"
								? [
										{
											onClick: () => {
												formType !== "employee" && setFormType("employee");
												dispatch(modalOpen());
											},
											disabled: loading || deleteData.isLoading,
											IconLeft: FaUserEdit,
											title: "Edit Employee",
										},
										{
											bg: "bg-yellow-600 hover:bg-yellow-500",
											IconLeft: FaLock,
											disabled: loading || deleteData.isLoading,
											onClick: () => {
												formType !== "password" && setFormType("password");
												dispatch(modalOpen());
											},
											title: "Change Password",
										},
										{
											bg: userActive
												? "bg-gray-500 hover:bg-gray-600"
												: "bg-green-500 hover:bg-green-600",
											disabled: loading || deleteData.isLoading,
											loading: loading,
											loader: true,
											onClick: () =>
												data?.user.email && userActive !== undefined
													? deactivate(data.user.email, userActive)
													: () => {},
											IconLeft: userActive ? FaUserSlash : FaUserCheck,
											title: userActive
												? "Deactivate Employee"
												: "Activate Employee",
										},
										{
											bg: "bg-red-600 hover:bg-red-500",
											IconLeft: FaTrash,
											disabled: loading || deleteData.isLoading,
											loading: deleteData.isLoading,
											loader: true,
											onClick: () => handleDeleteEmployee(data.id),
											title: "Delete Employee",
										},
								  ]
								: []
						}
					/>

					<div className="mt-4">
						<InfoComp
							infos={[
								{
									title: "First Name",
									value: toCapitalize(data?.user?.first_name) || "",
								},
								{
									title: "Last Name",
									value: toCapitalize(data?.user?.last_name) || "",
								},
								{ title: "E-mail", value: data?.user?.email || "" },
								{
									title: "Birthday",
									value: getDate(data?.profile?.date_of_birth, true) as string,
								},
								{
									title: "Gender",
									value: toCapitalize(data?.profile?.gender?.name) || "",
								},
								{
									title: "Status",
									value: data?.status || "inactive",
									type: "badge",
									options: {
										bg:
											data?.status === "active"
												? "success"
												: data?.status === "on leave"
												? "warning"
												: "error",
									},
								},
							]}
							title="personal information"
						/>

						<InfoComp
							infos={[
								{ title: "E-mail", value: data?.user?.email || "" },
								{ title: "Mobile", value: data?.profile?.phone || "" },
								{ title: "Address", value: data?.profile?.address || "" },
								{
									title: "State",
									value: toCapitalize(data?.profile?.state) || "",
								},
								{
									title: "City",
									value: toCapitalize(data?.profile?.city) || "",
								},
							]}
							title="contact information"
						/>

						<InfoComp
							infos={[
								{
									title: "Job Title",
									value: data?.job ? toCapitalize(data?.job?.name) : "------",
								},
								{
									title: "Department",
									value: data?.department
										? toCapitalize(data?.department?.name)
										: "-------",
								},
								{
									title: "Last Leave Date",
									value: data?.profile?.last_leave_info
										? `${getDate(
												data?.profile?.last_leave_info?.start_date,
												true
										  )} - ${getDate(
												data?.profile?.last_leave_info?.end_date,
												true
										  )}`
										: "-------",
								},
								{
									title: "Length Of Leave",
									value: data?.profile?.last_leave_info?.no_of_days
										? `${data.profile.last_leave_info.no_of_days} ${
												data.profile.last_leave_info.no_of_days > 1
													? "days"
													: "day"
										  }`
										: "-------",
								},
								{
									title: "Date Employed",
									value: data?.date_employed
										? (getDate(data?.date_employed, true) as string)
										: "----",
								},
							]}
							title="Additional information"
							titleWidth="w-[170px]"
						/>

						{data?.supervisor && (
							<InfoComp
								infos={[
									{
										title: "Image",
										value: { 
											src: data.supervisor?.image || DEFAULT_IMAGE,
											alt: data.supervisor?.full_name,
										}
									},
									{
										title: "First Name",
										value: data.supervisor?.first_name || "-------",
									},
									{
										title: "Last Name",
										value: data.supervisor?.last_name || "-------",
									},
									{
										title: "Email",
										value: data.supervisor?.email || "-------",
									},
									{
										title: "Job",
										value: data.supervisor?.job || "-------",
									},
								]}
								title="Supervisor Information"
							/>
						)}
					</div>

					<Modal
						close={() => dispatch(modalClose())}
						component={
							formType === "employee" ? (
								<EmployeeForm empId={id || ""} data={data} />
							) : formType === "password" ? (
								<ChangePasswordForm email={data.user?.email} />
							) : (
								<></>
							)
						}
						description={
							formType === "password"
								? "Fill the form to change employee password"
								: "Fill in the form to update employee information"
						}
						keepVisible
						title={
							formType === "password"
								? "Change Employee Password"
								: "Update Employee Information"
						}
						visible={modalVisible}
					/>
				</>
			)}
		</Container>
	);
};

export default Employee;