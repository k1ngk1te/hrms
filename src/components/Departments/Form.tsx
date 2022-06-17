import { FormEvent, FC, useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { useGetEmployeesQuery } from "../../store/features/employees-slice";
import { useAppSelector, useFormInput, useFormSelect } from "../../hooks";
import { toCapitalize } from "../../utils";
import { Button, Input, Select } from "../controls";

type FormType = {
  name: string;
  hod?: string;
};

type ErrorType = {
  name?: string;
  hod?: {
    id: string;
  }
};

type FormProps = {
  initState: FormType;
  editMode?: boolean;
  errors?: ErrorType;
  loading: boolean;
  success?: boolean;
  onSubmit: (form: FormType) => void;
};

type OptionsType = {
  title: string;
  value: string;
}[];

const Form: FC<FormProps> = ({
  initState,
  editMode,
  errors,
  loading,
  success,
  onSubmit,
}) => {
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_SIZE);
  const [empOptions, setEmpOptions] = useState<OptionsType>([]);

  const modalVisible = useAppSelector((state) => state.modal.visible);

  const employees = useGetEmployeesQuery(
    { limit, offset: 0, search: "" },
    {
      skip: !modalVisible,
    }
  );

  const employeesError = employees.error ? "unable to fetch employees" : "";

  const name = useFormInput(initState?.name);
  const hod = useFormSelect(initState?.hod ? String(initState?.hod) : "");

  const nameReset = name.reset;
  const hodReset = hod.reset;

  useEffect(() => {
    if (employees.data) {
      const options = employees.data.results.map((employee) => ({
        title: `${toCapitalize(employee.user.first_name)} ${toCapitalize(
          employee.user.last_name
        )}`,
        value: String(employee.id),
      }));
      setEmpOptions(options);
    }
  }, [employees.data]);

  useEffect(() => {
    if (success) {
      nameReset();
      hodReset();
    }
  }, [success, nameReset, hodReset]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = {
        name: name.value,
        hod: hod.value,
      };
      onSubmit(form);
    },
    [onSubmit, name.value, hod.value]
  );

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        <div className="w-full md:col-span-2">
          <Input
            disabled={loading}
            error={errors?.name}
            label="Department Name"
            required
            onChange={name.onChange}
            placeholder="Enter Name Of Department"
            value={name.value}
          />
        </div>
        <div className="w-full md:col-span-2">
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
                  setLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
                }
              },
              title: "load more",
            }}
            disabled={employees.isLoading || loading}
            error={employeesError || String(errors?.hod?.id || "")}
            label="Head Of Department (optional)"
            options={empOptions}
            required={false}
            onChange={hod.onChange}
            placeholder="Select Head Of Department"
            value={hod.value || ""}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={loading}
            loader
            loading={loading}
            title={editMode ? "update department" : "add department"}
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
