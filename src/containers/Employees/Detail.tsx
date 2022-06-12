import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaLock, FaUserEdit, FaUserCheck, FaUserSlash } from "react-icons/fa";
import {DEFAULT_IMAGE} from "../../config"
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { useGetEmployeeQuery } from "../../store/features/employees-slice";
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

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);
	const authData = useAppSelector((state) => state.auth.data);
	const admin_status = authData?.admin_status;
	const userActive = data?.active;

	const [formType, setFormType] = useState<"employee" | "password">("employee");

	const { deactivate, loading } = useDeactivateEmployee();

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
			error={
				error && isErrorWithData(error)
					? {
							statusCode: error.status,
							title: error.data.detail || error.data.error,
					  }
					: undefined
			}
		>
			{data && (
				<>
					<InfoTopBar
						email={data?.user.email}
						full_name={toCapitalize(
							`${data?.user?.first_name} ${data?.user?.last_name}`
						)}
						image={data?.profile?.image || "/static/images/default.png"}
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
											disabled: loading,
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
								image={{
									src: data.supervisor.image || DEFAULT_IMAGE,
									alt: "profile",
								}}
								infos={[
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