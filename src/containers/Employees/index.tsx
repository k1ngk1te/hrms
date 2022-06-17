import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE, EMPLOYEE_EXPORT_URL } from "../../config";
import { isFormError } from "../../store";
import {
	close as modalClose,
	open as modalOpen,
} from "../../store/features/modal-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { logout } from "../../store/features/auth-slice";
import {
	useCreateEmployeeMutation,
	useGetEmployeesQuery,
} from "../../store/features/employees-slice";
import { downloadFile, validateForm } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
	ErrorFormType,
	ErrorsKeyType,
	FormErrorType,
	FormType,
} from "../../types/employees";
import { Cards, EmployeeTable, Form, Topbar } from "../../components/Employees";
import { Container, Modal } from "../../components/common";

const initState = {
	image: undefined,
	first_name: "",
	last_name: "",
	email: "",
	department: "",
	job: "",
	supervisor: "",
	date_employed: "",
	date_of_birth: "",
	gender: "M",
	state: "",
	city: "",
	phone: "",
	address: "",
};

export const initErrorState = {
	image: "",
	first_name: "",
	last_name: "",
	email: "",
	department: "",
	date_employed: "",
	date_of_birth: "",
	job: "",
	supervisor: "",
	gender: "",
	state: "",
	city: "",
	phone: "",
	address: "",
};

const Employees = () => {
	const [errors, setErrors] = useState<ErrorFormType>(initErrorState);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [search, setSearch] = useState("");
	const [_status, setStatus] = useState<
		"" | "active" | "on leave" | "inactive"
	>("");

	const employees = useGetEmployeesQuery({
		limit: DEFAULT_PAGINATION_SIZE,
		offset,
		search,
	});

	const [createEmployee, { error, status }] = useCreateEmployeeMutation();

	const dispatch = useAppDispatch();
	const modalVisible = useAppSelector((state) => state.modal.visible);

	const [formSuccess, setFormSuccess] = useState<boolean>(false);

	useEffect(() => {
		const e1 =
			employees.error &&
			"status" in employees.error &&
			employees.error?.status === 401;
		if (e1 === true) dispatch(logout());
	}, [dispatch, employees.error]);

	useEffect(() => {
		if (status !== "pending") setLoading(false);
		if (status === "fulfilled") {
			dispatch(modalClose());
			setErrors(initErrorState);
			setFormSuccess(true);
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
					header: "Employee Created",
					message: "Employee was created successfully!",
				})
			);
		}
	}, [dispatch, status]);

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>, form: FormType) => {
			e.preventDefault();
			setLoading(true);
			const { valid, result } = validateForm(form, ["supervisor"]);
			if (valid) {
				const data: FormType = { ...form }
				if (form.email) data["email"] = form.email.toLowerCase()
				createEmployee(data);
			} else if (valid === false) {
				setErrors(result);
				setLoading(false);
			}
		},
		[createEmployee, dispatch]
	);

	const exportEmployee = useCallback(
		async (type: "csv" | "excel", filter: boolean) => {
			const url = `${EMPLOYEE_EXPORT_URL(type)}${
				filter ? `?name=${search}&status=${_status}` : ""
			}`;
			const response = await downloadFile(
				url,
				type === "csv" ? "employees.csv" : "employees.xls"
			);

			if (response?.status === 401) dispatch(logout());
			else if (response?.status !== 401 && response?.status !== 200)
				dispatch(
					alertModalOpen({
						color: "danger",
						Icon: FaTimesCircle,
						header: "Export Failed",
						message: "Failed to export data!",
					})
				);
		},
		[dispatch, search, _status]
	);

	return (
		<Container
			heading="Employees"
			refresh={{
				loading: employees.isFetching,
				onClick: () => employees.refetch(),
			}}
			disabledLoading={!employees.isLoading && employees.isFetching}
			loading={employees.isLoading}
			paginate={employees.data ? {
				offset, setOffset, loading: employees.isFetching,
				totalItems: employees.data.count || 0
			} : undefined}
		>
			<Cards
				active={employees.data?.active || 0}
				leave={employees.data?.on_leave || 0}
				inactive={employees.data?.inactive || 0}
			/>
			<Topbar
				openModal={() => {
					formSuccess === true && setFormSuccess(false);
					dispatch(modalOpen());
				}}
				loading={employees.isFetching}
				onSubmit={(name: string) => setSearch(name)}
				exportData={exportEmployee}
			/>
			<div className="mt-3">
				<EmployeeTable
					employees={employees.data?.results || []}
					setStatus={setStatus}
				/>
			</div>
			<Modal
				close={() => dispatch(modalClose())}
				component={
					<Form
						initState={initState}
						errors={
							isFormError<FormErrorType>(error) ? error.data : undefined
						}
						formErrors={errors}
						removeErrors={(name: ErrorsKeyType) => {
							if (
								errors &&
								errors[name] &&
								(errors[name] !== "" ||
									errors[name] !== undefined ||
									errors[name] !== null)
							)
								setErrors((prevState) => ({
									...prevState,
									[name]: "",
								}));
						}}
						loading={loading}
						onSubmit={handleSubmit}
						success={formSuccess}
					/>
				}
				description="Fill in the form below to add a new Employee"
				title="Add Employee"
				visible={modalVisible}
			/>
		</Container>
	);
};

export default Employees;