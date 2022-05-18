import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaLock, FaUserEdit, FaUserCheck, FaUserSlash } from "react-icons/fa";
import { NODE_ENV } from "@/config";
import { EMPLOYEES_PAGE_URL } from "@/config/routes";
import { isErrorWithData, isFormError } from "@/store";
import { logout } from "@/store/features/auth-slice";
import {
	useGetEmployeeQuery,
	useChangeEmployeePasswordMutation,
	useDeactivateEmployeeMutation,
} from "@/store/features/employees-slice";
import { open as alertModalOpen } from "@/store/features/alert-modal-slice";
import {
	open as modalOpen,
	close as modalClose,
} from "@/store/features/modal-slice";
import Error from "@/pages/error";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { LoadingPage, getDate, toCapitalize } from "@/utils";
import { ChangePasswordForm, EmployeeForm } from "@/components/Employees";
import { Container, InfoComp, InfoTopBar, Modal } from "@/components/common";

const Employee = () => {
	const { id } = useParams();
	const { data, error, isLoading, isFetching, refetch } = useGetEmployeeQuery(
		id || "",
		{
			skip: id === undefined,
		}
	);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);
	const authData = useAppSelector((state) => state.auth.data);
	const admin_status = authData?.admin_status;
	const userActive = data?.active;

	const [formType, setFormType] = useState<"employee" | "password">("employee");

	const [changePassword, passwordData] = useChangeEmployeePasswordMutation();
	const [deactivateEmployee, deactivateData] = useDeactivateEmployeeMutation();

	const handlePasswordChange = useCallback(
		(form: { password1: string; password2: string }) => {
			changePassword({
				...form,
				email: data?.user.email,
			});
		},
		[changePassword, data]
	);

	const handleDeactivateEmployee = useCallback(() => {
		dispatch(
			alertModalOpen({
				color: userActive ? "danger" : "success",
				header: userActive ? "Deactivate Employee" : "Activate employee",
				message: userActive
					? "Deactivating this employee will make this him/her unable to perform any action on this application.\n Use this instead of deleting the employee from database"
					: "Activating this employee will allow him/her to login and perform some basic actions on this applications",
				decisions: [
					{
						color: "info",
						title: "Cancel",
					},
					{
						onClick: () => {
							if (data?.user.email) {
								deactivateEmployee({
									email: data?.user.email,
									action: userActive ? "deactivate" : "activate",
								});
							}
						},
						color: userActive ? "danger" : "success",
						title: "Proceed",
					},
				],
			})
		);
	}, [deactivateEmployee, data, dispatch, userActive]);

	useEffect(() => {
		const e1 = error && "status" in error && error?.status === 401;
		const e2 =
			passwordData.error &&
			"status" in passwordData.error &&
			passwordData.error?.status === 401;
		if (e1 === true || e2 === true) dispatch(logout());
	}, [dispatch, error, passwordData.error]);

	useEffect(() => {
		if (deactivateData.status === "fulfilled") {
			dispatch(
				alertModalOpen({
					color: "success",
					header: "200",
					message: deactivateData.data.success,
				})
			);
		} else if (deactivateData.status === "rejected") {
			if (
				deactivateData.error &&
				"status" in deactivateData.error &&
				deactivateData.error?.status === 401
			)
				dispatch(logout());
			NODE_ENV === "development" && console.log(deactivateData.error);
		}
	}, [dispatch, deactivateData]);

	return isLoading ? (
		<LoadingPage />
	) : error && isErrorWithData(error) ? (
		<Error
			statusCode={error.status || 500}
			title={
				error.data.detail || error.data.error || "An unexpected error occurred"
			}
		/>
	) : (
		<Container
			heading="Employee Information"
			icon={{ link: EMPLOYEES_PAGE_URL }}
			refresh={{
				loading: isFetching,
				onClick: () => refetch(),
			}}
		>
			<InfoTopBar
				email={data?.user.email}
				full_name={toCapitalize(
					`${data?.user?.first_name} ${data?.user?.last_name}`
				)}
				image={
					data?.profile?.image_url ||
					data?.profile?.image ||
					"/images/default.png"
				}
				actions={
					admin_status === "hr" || admin_status === "md"
						? [
								{
									onClick: () => {
										formType !== "employee" && setFormType("employee");
										dispatch(modalOpen());
									},
									IconLeft: FaUserEdit,
									title: "Edit Employee",
								},
								{
									bg: "bg-gray-600 hover:bg-gray-500",
									IconLeft: FaLock,
									onClick: () => {
										formType !== "password" && setFormType("password");
										dispatch(modalOpen());
									},
									title: "Change Password",
								},
								{
									bg: userActive
										? "bg-red-500 hover:bg-red-600"
										: "bg-green-500 hover:bg-green-600",
									disabled: deactivateData?.isLoading || false,
									loading: deactivateData?.isLoading || false,
									loader: true,
									onClick: handleDeactivateEmployee,
									IconLeft: userActive ? FaUserSlash : FaUserCheck,
									title: userActive
										? "Deactivate Employee"
										: "Activate Employee",
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
						{ title: "State", value: toCapitalize(data?.profile?.state) || "" },
						{ title: "City", value: toCapitalize(data?.profile?.city) || "" },
					]}
					title="contact information"
				/>

				<InfoComp
					infos={[
						{
							title: "Job Title",
							value: toCapitalize(data?.job?.name) || "------",
						},
						{
							title: "Department",
							value: toCapitalize(data?.department?.name) || "",
						},
						{
							title: "Marital Status",
							value: toCapitalize(data?.profile?.marital_status.name) || "",
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
										data.profile.last_leave_info.no_of_days > 1 ? "days" : "day"
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

				{data?.supervisor_info && (
					<InfoComp
						image={{
							src: "/static/images/default.png",
							alt: "profile",
						}}
						infos={[
							{
								title: "First Name",
								value: data?.supervisor_info?.first_name || "-------",
							},
							{
								title: "Last Name",
								value: data?.supervisor_info?.last_name || "-------",
							},
							{
								title: "Email",
								value: data?.supervisor_info?.email || "-------",
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
						<ChangePasswordForm
							errors={
								passwordData.error &&
								isFormError<{
									new_password1?: string;
									new_password2?: string;
								}>(passwordData.error)
									? passwordData.error.data
									: undefined
							}
							errorStatus={
								passwordData.error && isErrorWithData(passwordData.error)
									? passwordData.error.status
									: 0
							}
							onSubmit={handlePasswordChange}
							isLoading={passwordData.isLoading}
							success={passwordData.status === "fulfilled"}
						/>
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
		</Container>
	);
};

export default Employee;
