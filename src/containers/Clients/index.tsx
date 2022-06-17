import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { isErrorWithData, isFormError } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../store/features/modal-slice";
import {
	useGetClientsQuery,
	useCreateClientMutation,
} from "../../store/features/employees-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Cards, ClientTable, Form, Topbar } from "../../components/Clients";
import { Container, Modal } from "../../components/common";
import { ClientCreateType } from "../../types/employees";

const Clients = () => {
	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");

	const { data, error, refetch, isLoading, isFetching } = useGetClientsQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search,
	});
	const [createClient, clientData] = useCreateClientMutation();

	const handleSubmit = useCallback(
		(form: ClientCreateType) => {
			createClient(form);
		},
		[createClient]
	);

	useEffect(() => {
		if (clientData.status === "fulfilled") {
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
					header: "Client Added",
					message: "Client was added successfully!",
				})
			);
		} else if (
			clientData.status === "rejected" &&
			isErrorWithData(clientData.error)
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
						clientData.error.data.detail ||
							clientData.error.data.error ||
							"Failed to add Client"
					),
				})
			);
		}
	}, [dispatch, clientData.status, clientData.error]);

	return (
		<Container
			heading="Clients"
			loading={isLoading}
			disabledLoading={!isLoading && isFetching}
			error={isErrorWithData(error) ? {
				statusCode: error?.status || 500,
				title: String(error.data?.detail || error.data?.error || "")
			} : undefined}
			refresh={{
				onClick: refetch,
				loading: isFetching
			}}
			paginate={data ? {
				loading: isFetching,
				offset, setOffset,
				totalItems: data.count || 0
			} : undefined}
		>
			<Cards
				active={data ? data.active : 0}
				inactive={data ? data.inactive : 0}
				total={data ? data.count : 0}
			/>
			<Topbar
				openModal={() => {
					dispatch(modalOpen());
				}}
				loading={isFetching}
				onSubmit={(name: string) => setSearch(name)}
			/>
			<ClientTable clients={data ? data.results : []} />
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						errors={
							clientData.error &&
							isFormError<ClientCreateType>(clientData.error)
								? clientData.error.data
								: undefined
						}
						loading={clientData.isLoading}
						onSubmit={(form: ClientCreateType) => handleSubmit(form)}
						success={clientData.status === "fulfilled"}
					/>
				}
				keepVisible={false}
				description="Fill in the form below to add a new Client"
				title="Add Client"
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Clients;
