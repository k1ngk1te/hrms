import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useState,
} from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { isErrorWithData, isFormError } from "../../store";
import { logout } from "../../store/features/auth-slice";
import {
	useGetLeavesQuery,
	useRequestLeaveMutation,
} from "../../store/features/leaves-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
	close as modalClose,
	open as modalOpen,
} from "../../store/features/modal-slice";
import { getDate, getNextDate, validateForm } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { FormType, FormErrorType } from "../../types/leaves";
import { Container, Modal } from "../../components/common";
import { Cards, Form, Topbar, LeaveTable } from "../../components/Leaves";

const initState: {
	leave_type: string;
	start_date: string;
	end_date: string;
	no_of_days: number;
	reason: string;
} = {
	leave_type: "C",
	start_date: getDate(undefined, true) as string,
	end_date: getNextDate(getDate(), 1, true) as string,
	no_of_days: 1,
	reason: "",
};

const Leave = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState(initState);
	const [dateQuery, setDateQuery] = useState({ from: "", to: "" });
	const [errors, setErrors] = useState<any>({});
	const [offset, setOffset] = useState(0);

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const leaves = useGetLeavesQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		from: dateQuery.from,
		to: dateQuery.to,
	});
	const [requestLeave, { error, status }] = useRequestLeaveMutation();

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
							error.data?.detail || error.data?.error || "Your request for a leave was rejected.",
					})
				);
			}
		}
	}, [dispatch, error]);

	useEffect(() => {
		if (status !== "pending") setLoading(false);
		if (status === "fulfilled") {
			setForm(initState);
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
					message: "Your request for a leave was submitted successfully.",
				})
			);
		}
	}, [dispatch, status]);

	useEffect(() => {
		if (form) {
			if (getDate(form.start_date) < getDate()) {
				setErrors((prevState: FormType) => ({
					...prevState,
					start_date: "Start date must not be before today's date",
				}));
			} else if (
				form.end_date &&
				getDate(form.end_date) <= getDate(form.start_date)
			) {
				setErrors((prevState: FormType) => ({
					...prevState,
					end_date: "End date must not be today or before today",
				}));
			}
		}
	}, [form]);

	const handleChange = useCallback(
		({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
			setForm((prevState) => ({
				...prevState,
				[name]: value,
			}));

			setErrors((prevState: FormType) => ({
				...prevState,
				[name]: "",
			}));

			if (name === "no_of_days") {
				const nod = parseInt(value) * 24 * 60 * 60 * 1000; // nod => no_of_days
				const sd = new Date(form.start_date).getTime(); // sd => start_date

				const ed = new Date(nod + sd).toLocaleDateString("en-CA"); // ed => end_date

				setForm((prevState) => ({
					...prevState,
					end_date: ed,
				}));
			} else if (name === "end_date") {
				const sd = new Date(form.start_date).getTime(); // sd => start_date
				const ed = new Date(value).getTime(); // ed => end_date

				const nod = (ed - sd) / 1000 / 60 / 60 / 24;

				setForm((prevState) => ({
					...prevState,
					no_of_days: nod,
				}));
			} else if (name === "start_date" && form.no_of_days) {
				const nod = form.no_of_days * 24 * 60 * 60 * 1000; // nod => no_of_days
				const sd = new Date(value).getTime(); // sd => start_date

				const ed = new Date(nod + sd).toLocaleDateString("en-CA"); // ed => end_date

				setForm((prevState) => ({
					...prevState,
					end_date: ed,
				}));
			}
		},
		[form]
	);

	const handleSelectChange = useCallback(
		({ target: { name, value } }: ChangeEvent<HTMLSelectElement>) => {
			setForm((prevState) => ({
				...prevState,
				[name]: value,
			}));
		},
		[]
	);

	const handleTextChange = useCallback(
		({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) => {
			setForm((prevState) => ({
				...prevState,
				[name]: value,
			}));
		},
		[]
	);

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setLoading(true);
			const { valid, result } = validateForm(form);
			if (valid) {
				requestLeave(form);
			} else if (valid === false) {
				setErrors(result);
				setLoading(false);
			}
		},
		[form, requestLeave]
	);

	return (
		<Container
			heading="Leaves"
			error={isErrorWithData(leaves.error) ? {
				statusCode: leaves.error.status || 500,
				title: String(leaves.error.data.detail || leaves.error.data.error || "")
			} : undefined}
			refresh={{
				loading: leaves?.isFetching,
				onClick: () => {
					setDateQuery({ from: "", to: "" });
					leaves?.refetch();
				},
			}}
			loading={leaves.isLoading}
			disabledLoading={!leaves.isLoading && leaves.isFetching}
			paginate={leaves.data ? {
				loading: leaves.isFetching, setOffset, offset,
				totalItems: leaves.data.count
			} : undefined}
		>
			<Cards
				approved={leaves.data?.approved_count || 0}
				denied={leaves.data?.denied_count || 0}
				pending={leaves.data?.pending_count || 0}
			/>
			<Topbar
				adminView={false}
				loading={leaves.isFetching}
				dateSubmit={({ fromDate, toDate }) =>
					setDateQuery({ from: fromDate, to: toDate })
				}
				openModal={() => dispatch(modalOpen())}
			/>
			<LeaveTable
				leaves={leaves.data?.results || []}
			/>
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						data={form}
						errors={isFormError<FormErrorType>(error) ? error.data : undefined}
						formErrors={errors}
						loading={loading}
						onChange={handleChange}
						onSubmit={handleSubmit}
						onSelectChange={handleSelectChange}
						onTextChange={handleTextChange}
					/>
				}
				description="Fill in the form below to request a leave"
				keepVisible
				title="Request Leave"
				visible={modalVisible}
			/>
		</Container>
	);
};

Leave.defaultProps = {
	adminView: false,
};

export default Leave;
