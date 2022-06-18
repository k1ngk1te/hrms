import { FC, useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import {
	useGetClientsQuery,
	useGetEmployeesQuery,
} from "../../store/features/employees-slice";
import {
	useAppSelector,
	useFormInput,
	useFormSelect,
	useFormTextArea,
} from "../../hooks";
import { toCapitalize, validateForm } from "../../utils";
import { Button, Input, Select, Textarea } from "../controls";
import { ProjectCreateType, ProjectCreateErrorType } from "../../types/employees";

export type FormProps = {
	editMode?: boolean;
	errors?: ProjectCreateErrorType;
	initState?: InitStateType;
	loading: boolean;
	success?: boolean;
	onSubmit: (form: ProjectCreateType) => void;
};

type OptionsType = {
	title: string;
	value: string;
}[];

const initialState = {
	name: "",
	client: "",
	start_date: "",
	end_date: "",
	initial_cost: 0,
	rate: 0,
	priority: "H",
	leaders: [],
	team: [],
	description: "",
};

export type InitStateType = {
	name: string;
	client?: string;
	start_date: string;
	end_date: string;
	initial_cost: number;
	rate: number;
	priority: string;
	leaders: string[];
	team: string[];
	description: string;
};
interface InitErrorType extends Omit<InitStateType, "team" | "leaders" | "initial_cost" | "priority" | "rate"> {
	team: string;
	leaders: string;
	initial_cost: string;
	rate: string;
	priority: string;
}

const initErrorState: InitErrorType | undefined = {
	name: "",
	client: "",
	start_date: "",
	end_date: "",
	initial_cost: "",
	rate: "",
	priority: "",
	leaders: "",
	team: "",
	description: "",
};

type InitErrorKeysType =
	| "name"
	| "client"
	| "start_date"
	| "end_date"
	| "initial_cost"
	| "rate"
	| "priority"
	| "leaders"
	| "team"
	| "description";

const Form: FC<FormProps> = ({
	editMode,
	errors,
	initState = initialState,
	loading,
	onSubmit,
	success,
}) => {
	const [formErrors, setErrors] = useState<InitErrorType>(initErrorState);

	const [clientLimit, setClientLimit] = useState(DEFAULT_PAGINATION_SIZE);
	const [empLimit, setEmpLimit] = useState(DEFAULT_PAGINATION_SIZE);
	const [clientOptions, setClientOptions] = useState<OptionsType>([]);
	const [empOptions, setEmpOptions] = useState<OptionsType>([]);

	const modalVisible = useAppSelector((state) => state.modal.visible);

	const clients = useGetClientsQuery(
		{ limit: clientLimit, offset: 0, search: "", active: true },
		{
			skip: !modalVisible,
		}
	);
	const employees = useGetEmployeesQuery(
		{ limit: empLimit, offset: 0, search: "" },
		{
			skip: !modalVisible,
		}
	);

	const employeesError = employees.error ? "unable to fetch employees" : "";
	const clientsError = clients.error ? "unable to fetch clients" : "";

	const removeErrors = useCallback(
		(name: InitErrorKeysType) => {
			if (
				formErrors &&
				formErrors[name] &&
				(formErrors[name] !== "" ||
					formErrors[name] !== undefined ||
					formErrors[name] !== null)
			)
				setErrors((prevState) => ({
					...prevState,
					[name]: "",
				}));
		},
		[formErrors]
	);

	useEffect(() => {
		if (employees.data) {
			const options = employees.data.results.map((employee) => ({
				title: `${toCapitalize(employee.user.first_name)} ${toCapitalize(
					employee.user.last_name
				)}`,
				value: employee.id,
			}));
			setEmpOptions(options);
		}
	}, [employees.data]);

	useEffect(() => {
		if (clients.data) {
			const options = clients.data.results.map((client) => ({
				title: client.company.toUpperCase(),
				value: String(client.id),
			}));
			setClientOptions(options);
		}
	}, [clients.data]);

	const name = useFormInput(initState.name, {
		onChange: () => (removeErrors ? removeErrors("name") : ""),
	});
	const client = useFormSelect(initState?.client || "", {
		onChange: () => (removeErrors ? removeErrors("client") : ""),
	});
	const start_date = useFormInput(initState.start_date, {
		onChange: () => (removeErrors ? removeErrors("start_date") : ""),
	});
	const end_date = useFormInput(initState.end_date, {
		onChange: () => (removeErrors ? removeErrors("end_date") : ""),
	});
	const initial_cost = useFormInput(initState.initial_cost, {
		onChange: () => (removeErrors ? removeErrors("initial_cost") : ""),
	});
	const rate = useFormInput(initState.rate, {
		onChange: () => (removeErrors ? removeErrors("rate") : ""),
	});
	const priority = useFormSelect(initState.priority, {
		onChange: () => (removeErrors ? removeErrors("priority") : ""),
	});
	const leaders = useFormSelect(initState.leaders, {
		onChange: () => (removeErrors ? removeErrors("leaders") : ""),
		multiple: true
	});
	const team = useFormSelect(initState.team, {
		onChange: () => (removeErrors ? removeErrors("team") : ""),
		multiple: true
	});
	const description = useFormTextArea(initState.description, {
		onChange: () => (removeErrors ? removeErrors("description") : ""),
	});

	const nameReset = name.reset;
	const clientReset = client.reset;
	const startDateReset = start_date.reset;
	const endDateReset = end_date.reset;
	const initialCostReset = initial_cost.reset;
	const rateReset = rate.reset;
	const priorityReset = priority.reset;
	const leadersReset = leaders.reset;
	const teamReset = team.reset;
	const descriptionReset = description.reset;

	useEffect(() => {
		if (!editMode && success) {
			setErrors(initErrorState);
			nameReset();
			clientReset();
			startDateReset();
			endDateReset();
			initialCostReset();
			rateReset();
			priorityReset();
			leadersReset();
			teamReset();
			descriptionReset();
		}
	}, [
		success,
		editMode,
		nameReset,
		clientReset,
		rateReset,
		startDateReset,
		endDateReset,
		initialCostReset,
		priorityReset,
		leadersReset,
		teamReset,
		descriptionReset,
	]);

	const handleSubmit = useCallback(
		(form: ProjectCreateType) => {
			const invalidates = ["client", "team", 'leaders']
			const { valid, result } = validateForm(form, invalidates);
			if (valid)
				onSubmit(form)
			else if (valid === false) setErrors(result);
		},
		[editMode, onSubmit]
	);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit({
					name: name.value,
					client: client.value,
					priority: priority.value,
					description: description.value,
					leaders: leaders.value.map((leader: string) => ({id: leader})),
					team: team.value.map((team: string) => ({id: team})),
					start_date: start_date.value,
					end_date: end_date.value,
					initial_cost: initial_cost.value,
					rate: rate.value,
				});
			}}
			className="p-4"
		>
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.name || errors?.name || ""}
						label="Project Name"
						onChange={name.onChange}
						placeholder="Enter the name of the Project"
						required
						value={name.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Select
						btn={{
							disabled: clients.isFetching,
							loader: true,
							loading: clients.isFetching,
							onClick: () => {
								if (
									clients.data &&
									clients.data.count > clients.data.results.length
								) {
									setClientLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
								}
							},
							title: "load more",
						}}
						disabled={clients.isLoading || loading}
						error={clientsError || formErrors?.client || errors?.client || ""}
						label="Client"
						onChange={client.onChange}
						required={false}
						placeholder="Select Client"
						options={clientOptions}
						value={client.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.start_date || errors?.start_date || ""}
						label="Start Date"
						onChange={start_date.onChange}
						placeholder="Enter the Start date for the project"
						required
						type="date"
						value={start_date.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.end_date || errors?.end_date || ""}
						label="Deadline"
						onChange={end_date.onChange}
						placeholder="Enter the Project Deadline"
						required
						type="date"
						value={end_date.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.initial_cost || errors?.initial_cost || ""}
						label="Initial Cost"
						onChange={initial_cost.onChange}
						placeholder="Enter the initial cost to start this project"
						required
						type="number"
						value={initial_cost.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.rate || errors?.rate || ""}
						label="Rate"
						onChange={rate.onChange}
						placeholder="Enter the rate per hour e.g. 20"
						required
						type="number"
						value={rate.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Select
						disabled={loading}
						error={formErrors?.priority || errors?.priority || ""}
						label="Priority"
						onChange={priority.onChange}
						options={[
							{ title: "High", value: "H" },
							{ title: "Medium", value: "M" },
							{ title: "Low", value: "L" },
						]}
						required
						value={priority.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Select
						btn={{
							disabled: employees.isFetching,
							loader: true,
							loading: employees.isFetching,
							onClick: () => {
								if (
									employees.data &&
									employees.data.count > employees.data.results.length
								) {
									setEmpLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
								}
							},
							title: "load more",
						}}
						disabled={employees.isLoading || loading}
						error={
							employeesError || formErrors?.leaders || errors?.leaders || ""
						}
						label="Team Leaders"
						onChange={leaders.onChange}
						multiple
						placeholder="Select Team Leaders"
						options={empOptions}
						required={false}
						value={leaders.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Select
						btn={{
							disabled: employees.isFetching,
							loader: true,
							loading: employees.isFetching,
							onClick: () => {
								if (
									employees.data &&
									employees.data.count > employees.data.results.length
								) {
									setEmpLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
								}
							},
							title: "load more",
						}}
						disabled={employees.isLoading || loading}
						error={employeesError || formErrors?.team || errors?.team || ""}
						label="Team"
						onChange={team.onChange}
						multiple
						placeholder="Select Team Members"
						options={empOptions}
						required={false}
						value={team.value}
					/>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Textarea
						disabled={loading}
						error={formErrors?.description || errors?.description || ""}
						label="Project Description"
						onChange={description.onChange}
						placeholder="Describe this project"
						value={description.value}
					/>
				</div>
			</div>
			<div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
				<div className="w-full sm:w-1/2 md:w-1/3">
					<Button
						disabled={loading}
						loader
						loading={loading}
						title="submit"
						type="submit"
					/>
				</div>
			</div>
		</form>
	);
};

Form.defaultProps = {
	editMode: false,
};

export default Form;
