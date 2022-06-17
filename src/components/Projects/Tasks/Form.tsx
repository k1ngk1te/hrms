import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { DEFAULT_PAGINATION_SIZE } from "../../../config";
import {
	useGetProjectEmployeesQuery
} from "../../../store/features/projects-slice";
import {
	useAppSelector,
	useFormInput,
	useFormSelect,
	useFormTextArea,
} from "../../../hooks";
import { toCapitalize, validateForm } from "../../../utils";
import { Button, Input, Select, Textarea } from "../../controls";
import { TaskCreateType, TaskCreateErrorType,TaskFormInitStateType } from "../../../types/employees";

export type FormProps = {
	editMode?: boolean;
	errors?: TaskCreateErrorType;
	initState?: TaskFormInitStateType;
	loading: boolean;
	success?: boolean;
	onSubmit: (form: TaskCreateType) => void;
};

type OptionsType = {
	title: string;
	value: string;
}[];

const initialState = {
	followers: [],
	leaders: [],
	name: "",
	priority: "H",
	due_date: "",
	description: ""
};

interface InitErrorType extends Omit<TaskFormInitStateType, "followers" | "leaders"> {
	followers: string;
	leaders: string;
}

const initErrorState: InitErrorType | undefined = {
	name: "",
	due_date: "",
	priority: "",
	leaders: "",
	followers: "",
	description: "",
};

type InitErrorKeysType =
	| "name"
	| "due_date"
	| "priority"
	| "leaders"
	| "followers"
	| "description";

const Form: FC<FormProps> = ({
	editMode,
	errors,
	initState = initialState,
	loading,
	onSubmit,
	success,
}) => {
	const { id } = useParams()
	const [formErrors, setErrors] = useState<InitErrorType>(initErrorState);

	const [empLimit, setEmpLimit] = useState(DEFAULT_PAGINATION_SIZE);
	const [empOptions, setEmpOptions] = useState<OptionsType>([]);

	const modalVisible = useAppSelector((state) => state.modal.visible);

	const employees = useGetProjectEmployeesQuery(
		{ limit: empLimit, offset: 0, project_id: id || "" },
		{
			skip: !modalVisible,
		}
	);

	const employeesError = employees.error ? "unable to fetch employees" : "";

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
				title: toCapitalize(employee.full_name),
				value: employee.id,
			}));
			setEmpOptions(options);
		}
	}, [employees.data]);

	const name = useFormInput(initState.name, {
		onChange: () => (removeErrors ? removeErrors("name") : ""),
	});
	const due_date = useFormInput(initState.due_date, {
		onChange: () => (removeErrors ? removeErrors("due_date") : ""),
	});
	const priority = useFormSelect(initState.priority, {
		onChange: () => (removeErrors ? removeErrors("priority") : ""),
	});
	const leaders = useFormSelect(initState.leaders, {
		onChange: () => (removeErrors ? removeErrors("leaders") : ""),
		multiple: true
	});
	const followers = useFormSelect(initState.followers, {
		onChange: () => (removeErrors ? removeErrors("followers") : ""),
		multiple: true
	});
	const description = useFormTextArea(initState.description, {
		onChange: () => (removeErrors ? removeErrors("description") : ""),
	});

	const nameReset = name.reset;
	const dueDateReset = due_date.reset;
	const priorityReset = priority.reset;
	const leadersReset = leaders.reset;
	const followersReset = followers.reset;
	const descriptionReset = description.reset;

	useEffect(() => {
		if (!editMode && success) {
			setErrors(initErrorState);
			nameReset();
			dueDateReset();
			priorityReset();
			leadersReset();
			followersReset();
			descriptionReset();
		}
	}, [
		success,
		editMode,
		nameReset,
		dueDateReset,
		priorityReset,
		leadersReset,
		followersReset,
		descriptionReset,
	]);

	const handleSubmit = useCallback(
		(form: TaskCreateType) => {
			const invalidates = ["followers", 'leaders']
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
					priority: priority.value,
					description: description.value,
					leaders: leaders.value.map((leader: string) => ({id: leader})),
					followers: followers.value.map((team: string) => ({id: team})),
					due_date: due_date.value,
				});
			}}
			className="p-4"
		>
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
				<div className="w-full md:flex md:flex-col md:col-span-2 md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.name || errors?.name || ""}
						label="Task Name"
						onChange={name.onChange}
						placeholder="Enter the name of the Task"
						required
						value={name.value}
					/>
				</div>
				<div className="w-full md:flex md:flex-col md:justify-end">
					<Input
						disabled={loading}
						error={formErrors?.due_date || errors?.due_date || ""}
						label="Due Date"
						onChange={due_date.onChange}
						placeholder="Enter the Project Deadline"
						required
						type="date"
						value={due_date.value}
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
						label="Task Leaders"
						onChange={leaders.onChange}
						multiple
						placeholder="Select Task Leaders"
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
						error={employeesError || formErrors?.followers || errors?.followers || ""}
						label="Task Followers"
						onChange={followers.onChange}
						multiple
						placeholder="Select Task Followers"
						options={empOptions}
						required={false}
						value={followers.value}
					/>
				</div>
				<div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
					<Textarea
						disabled={loading}
						error={formErrors?.description || errors?.description || ""}
						label="Task Description"
						onChange={description.onChange}
						placeholder="Describe the task in full detail"
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
