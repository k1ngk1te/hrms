import { FC, useCallback, useEffect, useState } from "react";

import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { useGetEmployeesQuery } from "../../store/features/employees-slice";
import { useAppSelector, useFormInput, useFormSelect, useFormTextArea } from "../../hooks";
import { toCapitalize, getDate,validateForm } from "../../utils";
import { OvertimeCreateType, OvertimeCreateErrorType } from "../../types/leaves";
import { Button, Input, Select, Textarea } from "../controls";

type FormProps = {
  adminView?: boolean;
  editMode?: false
  initState?: OvertimeCreateType;
  errors?: OvertimeCreateErrorType;
  loading: boolean;
  onSubmit: (form: OvertimeCreateType) => void;
  success?: boolean;
};

const initErrorState = {
  employee: undefined, overtime_type: undefined, date: undefined,
  hours: undefined, reason: undefined
}

export type InitErrorType = {
  employee?: string;
  overtime_type?: string;
  date?: string;
  hours?: string;
  reason?: string;
}

export type InitErrorKey = "overtime_type" | "employee" | "date" | "reason" | "hours";

const Form: FC<FormProps> = ({
  adminView,
  editMode,
  initState = {
    employee: "",
    overtime_type: "C",
    date: getDate(undefined, true) as string,
    hours: 1,
    reason: ""
  },
  errors,
  success,
  loading,
  onSubmit,
}) => {
  const [formErrors, setFormErrors] = useState<InitErrorType>(initErrorState)
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

  const removeError = useCallback((key: InitErrorKey) => {
    setFormErrors(prevState => ({ ...prevState, [key]: "" }))
  }, [])

  const employee = useFormSelect(initState?.employee || "", {
    onChange: () => removeError("employee")
  })
  const overtime_type = useFormSelect(initState?.overtime_type || "", {
    onChange: () => removeError("overtime_type")
  })
  const date = useFormInput(initState?.date || "", {
    onChange: () => removeError("date")
  })
  const hours = useFormInput(initState?.hours || "", {
    onChange: () => removeError("hours")
  })
  const reason = useFormTextArea(initState?.reason || "", {
    onChange: () => removeError("reason")
  })

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
    if (success === true && editMode === false) {
      employee.reset();
      overtime_type.reset();
      date.reset();
      hours.reset();
      reason.reset();
    }
  }, [
    success, 
    editMode,
    employee.reset,
    overtime_type.reset,
    date.reset,
    hours.reset,
    reason.reset
  ])

  const handleSubmit = useCallback((form: OvertimeCreateType) => {
    const invalidates = adminView ? [] : ["employee"]
    const {valid,result} = validateForm(form, invalidates)
    if (valid) onSubmit(form)
    else setFormErrors(prevState => ({ ...prevState, ...result }))
  }, [onSubmit, adminView])

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        const form: OvertimeCreateType = {
          overtime_type: overtime_type.value,
          date: date.value,
          hours: hours.value,
          reason: reason.value,
        }
        if (adminView === true) form.employee = employee.value
        handleSubmit(form)
      }} 
      className="p-4"
    >
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
              onChange={employee.onChange}
              options={empOptions}
              required
              value={employee.value || ""}
            />
          </div>
        )}
        <div className="w-full md:col-span-2">
          <Select
            disabled={loading}
            error={formErrors?.overtime_type || errors?.overtime_type || ""}
            label="Select Type"
            name="overtime_type"
            onChange={overtime_type.onChange}
            options={[
              { title: "Compulsory", value: "C" },
              { title: "Holiday", value: "H" },
              { title: "Voluntary", value: "V" }
            ]}
            required
            value={overtime_type.value || ""}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={formErrors?.date || errors?.date || ""}
            label="Select Date"
            name="date"
            onChange={date.onChange}
            placeholder="Enter Date"
            required
            type="date"
            value={date.value || ""}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={formErrors?.hours || errors?.hours || ""}
            label="Hours"
            name="hours"
            onChange={hours.onChange}
            placeholder="Enter number of hours"
            min="1"
            max="7"
            type="number"
            required
            value={hours.value || ""}
          />
        </div>
        <div className="w-full md:col-span-2">
          <Textarea
            disabled={loading}
            error={formErrors?.reason || errors?.reason || ""}
            label="Reason For Overtime"
            name="reason"
            onChange={reason.onChange}
            placeholder="Enter your reason for Overtime"
            required
            value={reason.value || ""}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={loading}
            loader
            loading={loading}
            title="request overtime"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

Form.defaultProps = {
  adminView: false,
  editMode: false,
};

export default Form;
