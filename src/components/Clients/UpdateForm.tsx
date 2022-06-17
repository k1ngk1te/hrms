import { useCallback, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { isErrorWithData, isFormError } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { close as modalClose } from "../../store/features/modal-slice";
import { useUpdateClientMutation } from "../../store/features/employees-slice";
import { useAppDispatch } from "../../hooks";
import { ClientCreateType, ClientFormErrorType, ClientType } from "../../types/employees";
import Form from "./Form";

const UpdateForm = ({ client }: { client: ClientType }) => {
	const dispatch = useAppDispatch();

	const [
		updateClient,
		{ error, status, isLoading },
	] = useUpdateClientMutation();

	const handleSubmit = useCallback(
		(form: ClientCreateType, id: string) => {
			updateClient({ id, data: form });
		},
		[updateClient]
	);

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
					header: "Client Updated",
					message: "Client was updated successfully!",
				})
			);
		} else if (status === "rejected" && isErrorWithData(error)) {
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
						error.data.detail || error.data.error || "Failed to add Client"
					),
				})
			);
		}
	}, [dispatch, status, error]);

	return (
		<Form
			initState={{
				image: undefined,
				first_name: client.contact.first_name,
				last_name: client.contact.last_name,
				email: client.contact.email,
				date_of_birth: client.contact.profile.date_of_birth || "",
				gender: client.contact.profile.gender.value || "M",
				state: client.contact.profile.state || "",
				city: client.contact.profile.city || "",
				phone: client.contact.profile.phone || "",
				address: client.contact.profile.address || "",
				company: client.company,
				position: client.position,
			}}
			editMode
			errors={
				error && isFormError<ClientFormErrorType>(error) ? error.data : undefined
			}
			loading={isLoading}
			onSubmit={(form: ClientCreateType) => handleSubmit(form, client.id)}
		/>
	);
};

export default UpdateForm;
