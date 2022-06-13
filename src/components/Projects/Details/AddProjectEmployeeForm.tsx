// Unused. This code was not implemented. Delete if not needed

import { FC, useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../../../config"
import { useGetEmployeesQuery } from "../../../store/features/employees-slice";
import { useAppSelector, useFormSelect } from "../../../hooks";
import { toCapitalize } from "../../../utils";
import { Button, Select } from "../../controls";

export type AddProjectEmployeeFormType = {
	team: { id: string }[];
};

export type FormProps = {
	name: string;
	employeesIDList: string[]; // A string containing the list ID of project employees(i.e leaders or team)
	errors?: {
		team: string;
	};
	loading: boolean;
	onSubmit: (form: AddProjectEmployeeFormType) => void;
};

type OptionsType = {
	title: string;
	value: string;
}[];

export const AddProjectEmployeeForm: FC<FormProps> = ({
	name,
	errors,
	employeesIDList,
	loading,
	onSubmit,
}) => {
	const [empLimit, setEmpLimit] = useState(DEFAULT_PAGINATION_SIZE);
	const [empOptions, setEmpOptions] = useState<OptionsType>([]);

	const modalVisible = useAppSelector((state) => state.modal.visible);

	const employees = useGetEmployeesQuery(
		{ limit: empLimit, offset: 0 },
		{
			skip: modalVisible === false,
		}
	);

	const employeesError = employees.error ? "unable to fetch employees" : "";

	const team = useFormSelect([], {
		multiple: true,
		onChange: () => {},
	});

	useEffect(() => {
		if (employees.data && employees.status === "fulfilled") {
			const options = employees.data.results.filter((employee) => {
				if (!employeesIDList.includes(employee.id))
					return {
						title: `${toCapitalize(employee.user.first_name)} ${toCapitalize(
							employee.user.last_name
						)}`,
						value: employee.id,
					};
			});
			const filterOptions = options.filter(
				(option) => !employeesIDList.includes(option.value) && option
			);
			filterOptions.length > 0 && setEmpOptions(filterOptions);
		}
	}, [employees.data, employees.status, employeesIDList]);

	const handleSubmit = useCallback(
		(teamValue: string[]) => {
			onSubmit({
				team: teamValue.value.map((member: string) => ({ id: member })),
			});
		},
		[team, onSubmit]
	);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(team);
			}}
			className="p-4"
		>
			<div className="p-2 md:p-4 lg:p-6">
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
						error={employeesError || errors?.team || ""}
						label={`Team ${name || ""}`}
						onChange={team.onChange}
						multiple
						placeholder={`Select Team ${name || ""}`}
						options={empOptions}
						required
						value={team.value}
					/>
				</div>
			</div>
			<div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
				<div className="w-full sm:w-1/2 md:w-1/3">
					<Button
						disabled={loading}
						loader
						loading={loading}
						title="add"
						type="submit"
					/>
				</div>
			</div>
		</form>
	);
};

export default AddProjectEmployeeForm;
