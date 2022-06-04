import { useState } from "react";
import { useParams } from "react-router-dom";
import {
	FaCheckCircle,
	FaTimesCircle,
	FaUserCheck,
	FaUserEdit,
	FaUserSlash,
	FaLock,
} from "react-icons/fa";
import { isErrorWithData } from "../../store";
import { close as modalClose, open as modalOpen } from "../../store/features/modal-slice";
import { useGetClientQuery } from "../../store/features/employees-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeactivateEmployee } from "../../hooks/employees";
import { UpdateForm } from "../../components/Clients";
import { ChangePasswordForm } from "../../components/Employees";
import { Container, InfoTopBar, InfoComp, Modal } from "../../components/common";
import { toCapitalize, getDate } from "../../utils";
import NotFound from "../../pages/404";

const ClientDetail = () => {
	const { id } = useParams();

	const [formType, setFormType] = useState<"client" | "password">("client");

	const { data, error, isLoading, refetch } = useGetClientQuery(id || "", {
		skip: id === undefined,
	});

	const dispatch = useAppDispatch();
	const authData = useAppSelector((state) => state.auth.data);
	const modalVisible = useAppSelector((state) => state.modal.visible);
	const admin_status = authData?.admin_status;
	const userActive = data?.contact?.active;

	const { deactivate, loading } = useDeactivateEmployee("client");

	return (
		<Container
			heading="Client Information"
			refresh={{
				onClick: refetch,
			}}
			icon
			loading={isLoading}
			error={
				isErrorWithData(error)
					? {
							statusCode:
								error && isErrorWithData(error) ? error.status : undefined,
							title:
								error && isErrorWithData(error)
									? String(error.data?.detail || error.data?.error || "")
									: undefined,
					  }
					: undefined
			}
		>
			{data && (
				<>
					<InfoTopBar
						email={data?.contact.email}
						full_name={toCapitalize(
							`${data?.contact?.first_name} ${data?.contact?.last_name}`
						)}
						image={data?.contact?.profile.image || "/static/images/default.png"}
						actions={
							admin_status === "hr" || admin_status === "md"
								? [
										{
											onClick: () => {
												formType !== "client" && setFormType("client");
												dispatch(modalOpen());
											},
											IconLeft: FaUserEdit,
											title: "Edit Client",
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
												data?.contact.email && userActive !== undefined
													? deactivate(data.contact.email, userActive)
													: () => {},
											IconLeft: userActive ? FaUserSlash : FaUserCheck,
											title: userActive
												? "Deactivate Client"
												: "Activate Client",
										},
								  ]
								: []
						}
					/>

					<div className="mt-4">
						<InfoComp
							infos={[
								{
									title: "ID",
									value: String(data?.id || "") || "",
								},
								{
									title: "Company",
									value: data?.company?.toUpperCase() || "",
								},
								{ title: "Position", value: data?.position || "" },
								{
									title: "Status",
									type: "badge",
									value: data.contact.active ? "active" : "inactive",
									options: {
										bg: data.contact.active ? "success" : "error",
										Icon: data.contact.active ? FaCheckCircle : FaTimesCircle,
									},
								},
							]}
							title="client information"
						/>
					</div>
					<div className="mt-4">
						<InfoComp
							infos={[
								{
									title: "First Name",
									value: toCapitalize(data?.contact?.first_name) || "",
								},
								{
									title: "Last Name",
									value: toCapitalize(data?.contact?.last_name) || "",
								},
								{ title: "E-mail", value: data?.contact?.email || "" },
								{
									title: "Birthday",
									value: getDate(
										data?.contact?.profile.date_of_birth,
										true
									) as string,
								},
								{
									title: "Gender",
									value: toCapitalize(data?.contact?.profile.gender.name) || "",
								},
							]}
							title="contact person information"
						/>
					</div>
					<div className="mt-4">
						<InfoComp
							infos={[
								{
									title: "Phone",
									value: data?.contact?.profile.phone || "",
								},
								{
									title: "Address",
									value: data?.contact?.profile.address || "",
								},
								{
									title: "State",
									value: toCapitalize(data?.contact?.profile.state) || "",
								},
								{
									title: "City",
									value: toCapitalize(data?.contact?.profile.city) || "",
								},
							]}
							title="contact & support information"
						/>
					</div>
					<Modal
						close={() => dispatch(modalClose())}
						component={
							formType === "client" && data !== undefined ? (
								<UpdateForm client={data} />
							) : formType === "password" ? (
								<ChangePasswordForm type="client" email={data.contact?.email} />
							) : (
								<></>
							)
						}
						description={
							formType === "password"
								? "Fill the form to change client password"
								: "Fill in the form to update client information"
						}
						keepVisible
						title={
							formType === "password"
								? "Change Client Password"
								: "Update Client Information"
						}
						visible={modalVisible}
					/>
				</>
			)}
		</Container>
	);
};

export default ClientDetail;