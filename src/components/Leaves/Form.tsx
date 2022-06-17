import { ChangeEvent, FormEvent, FC, useEffect, useState } from "react";

import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { useGetEmployeesQuery } from "../../store/features/employees-slice";
import { useAppSelector } from "../../hooks";
import { toCapitalize } from "../../utils";
import { FormType, FormErrorType } from "../../types/leaves";
import { Button, Input, Select, Textarea } from "../controls";

type FormProps = {
  adminView?: boolean;
  data: FormType;
  errors?: FormErrorType;
  formErrors?: any;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

const Form: FC<FormProps> = ({
  adminView,
  data,
  errors,
  formErrors,
  loading,
  onChange,
  onSubmit,
  onSelectChange,
  onTextChange,
}) => {
  const [empLimit, setEmpLimit] = useState(DEFAULT_PAGINATION_SIZE);
  const [empOptions, setEmpOptions] = useState<any>([]);

  const modalVisible = useAppSelector((state) => state.modal.visible);
  const employees = useGetEmployeesQuery(
    { limit: empLimit, offset: 0, search: "" },
    {
      skip: (adminView && modalVisible === true) ? false : true,
    }
  );

  const employeesError = employees.error ? "unable to fetch employees" : "";

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

  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        {adminView && (
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
                    setEmpLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
                  }
                },
                title: "load more",
              }}
              disabled={employees.isLoading || loading}
              error={
                employeesError || formErrors?.employee || errors?.employee || ""
              }
              label="Employee"
              name="employee"
              placeholder="Select Employee"
              onChange={onSelectChange}
              options={empOptions}
              required
              value={data?.employee || ""}
            />
          </div>
        )}
        <div className="w-full md:col-span-2">
          <Select
            disabled={loading}
            error={formErrors?.leave_type || errors?.leave_type || ""}
            label="Select Type"
            name="leave_type"
            onChange={onSelectChange}
            options={[
              { title: "Annual", value: "A" },
              { title: "Causal", value: "C" },
              { title: "Hospitalization", value: "H" },
              { title: "Loss Of Pay", value: "LOP" },
              { title: "Maternity", value: "M" },
              { title: "Paternity", value: "P" },
              { title: "Sick", value: "S" },
            ]}
            required
            value={data?.leave_type || ""}
          />
        </div>
        <div className="w-full md:col-span-2">
          <Input
            disabled={loading}
            error={formErrors?.no_of_days ? String(formErrors?.no_of_days) : ""}
            helpText="This will calculate the number of days from the start date and automatically set the end date. Do note that if the end date is altered, the number of days will respond to that alteration."
            label="Number Of Days (optional)"
            min="1"
            name="no_of_days"
            onChange={onChange}
            placeholder="Enter Number of Days"
            type="number"
            value={data?.no_of_days || ""}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={formErrors?.start_date || errors?.start_date || ""}
            label="Select Start Date"
            name="start_date"
            onChange={onChange}
            placeholder="Enter Date"
            required
            type="date"
            value={data?.start_date || ""}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={formErrors?.end_date || errors?.end_date || ""}
            label="Select End Date"
            name="end_date"
            onChange={onChange}
            placeholder="Enter Date"
            required
            type="date"
            value={data?.end_date || ""}
          />
        </div>
        <div className="w-full md:col-span-2">
          <Textarea
            disabled={loading}
            error={formErrors?.reason || errors?.reason || ""}
            label="Reason For Leave"
            name="reason"
            onChange={onTextChange}
            placeholder="Enter your reason for Leave"
            required
            value={data?.reason || ""}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={loading}
            loader
            loading={loading}
            title="request leave"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

Form.defaultProps = {
  adminView: false,
};

export default Form;
