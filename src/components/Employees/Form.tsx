import { FormEvent, FC, useCallback, useEffect, useState } from "react";

import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { useGetDepartmentsQuery } from "../../store/features/departments-slice";
import { useGetEmployeesQuery } from "../../store/features/employees-slice";
import { useGetJobsQuery } from "../../store/features/jobs-slice";
import {
  useAppSelector,
  useFormInput,
  useFormSelect,
  useFormTextArea,
} from "../../hooks";
import { toCapitalize } from "../../utils";
import { ErrorFormType, ErrorsKeyType, FormType, FormErrorType } from "../../types/employees";
import { Button, File, Input, Select, Textarea } from "../controls";

type FormProps = {
  initState: FormType;
  editMode?: boolean;
  errors?: FormErrorType;
  formErrors?: ErrorFormType;
  removeErrors?: (name: ErrorsKeyType) => void;
  loading: boolean;
  success?: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>, form: FormType) => void;
};

type OptionsType = {
  title: string;
  value: string;
}[];

const Form: FC<FormProps> = ({
  editMode,
  initState,
  errors,
  formErrors,
  removeErrors,
  loading,
  success,
  onSubmit,
}) => {
  const [depLimit, setDepLimit] = useState(DEFAULT_PAGINATION_SIZE);
  const [empLimit, setEmpLimit] = useState(DEFAULT_PAGINATION_SIZE);
  const [jobLimit, setJobLimit] = useState(DEFAULT_PAGINATION_SIZE);
  const [depOptions, setDepOptions] = useState<OptionsType>([]);
  const [empOptions, setEmpOptions] = useState<OptionsType>([]);
  const [jobOptions, setJobOptions] = useState<OptionsType>([]);

  const modalVisible = useAppSelector((state) => state.modal.visible);

  const jobs = useGetJobsQuery(
    { limit: jobLimit, offset: 0, search: "" },
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
  const departments = useGetDepartmentsQuery(
    { limit: depLimit, offset: 0, search: "" },
    {
      skip: !modalVisible,
    }
  );

  const departmentsError = departments.error
    ? "unable to fetch departments"
    : "";
  const employeesError = employees.error ? "unable to fetch employees" : "";
  const jobsError = jobs.error ? "unable to fetch jobs" : "";

  const image = useFormInput(initState?.image, {
    onChange: () => removeErrors ? removeErrors("image") : ""
  });
  const first_name = useFormInput(initState?.first_name, {
    onChange: () => removeErrors ? removeErrors("first_name") : ""
  });
  const last_name = useFormInput(initState?.last_name, {
    onChange: () => removeErrors ? removeErrors("last_name") : ""
  });
  const email = useFormInput(initState?.email, {
    onChange: () => removeErrors ? removeErrors("email") : ""
  });
  const gender = useFormSelect(initState?.gender, {
    onChange: () => removeErrors ? removeErrors("gender") : ""
  });
  const address = useFormTextArea(initState?.address, {
    onChange: () => removeErrors ? removeErrors("address") : ""
  });
  const phone = useFormInput(initState?.phone, {
    onChange: () => removeErrors ? removeErrors("phone") : ""
  });
  const state = useFormInput(initState?.state, {
    onChange: () => removeErrors ? removeErrors("state") : ""
  });
  const supervisor = useFormSelect(initState?.supervisor, {
    onChange: () => removeErrors ? removeErrors("supervisor") : ""
  });
  const city = useFormInput(initState?.city, {
    onChange: () => removeErrors ? removeErrors("city") : ""
  });
  const job = useFormSelect(initState?.job, {
    onChange: () => removeErrors ? removeErrors("job") : ""
  });
  const department = useFormSelect(initState?.department, {
    onChange: () => removeErrors ? removeErrors("department") : ""
  });
  const date_of_birth = useFormInput(initState?.date_of_birth, {
    onChange: () => removeErrors ? removeErrors("date_of_birth") : ""
  });
  const date_employed = useFormInput(initState?.date_employed, {
    onChange: () => removeErrors ? removeErrors("date_employed") : ""
  });

  const imageReset = image.reset;
  const firstNameReset = first_name.reset;
  const lastNameReset = last_name.reset;
  const emailReset = email.reset;
  const genderReset = gender.reset;
  const addressReset = address.reset;
  const phoneReset = phone.reset;
  const stateReset = state.reset;
  const supervisorReset = supervisor.reset;
  const cityReset = city.reset;
  const jobReset = job.reset;
  const departmentReset = department.reset;
  const dobReset = date_of_birth.reset;
  const dEmployedReset = date_employed.reset;

  useEffect(() => {
    if (departments.data) {
      const options = departments.data.results.map((department) => ({
        title: toCapitalize(department.name),
        value: String(department.id),
      }));
      setDepOptions(options);
    }
  }, [departments.data]);

  useEffect(() => {
    if (employees.data) {
      const options: OptionsType = []
      employees.data.results.forEach(employee => {
        if (employee.user.active) {
          options.push({
            title: toCapitalize(employee.user.full_name),
            value: String(employee.id),
          })
        }
      })
      setEmpOptions(options);
    }
  }, [employees.data]);

  useEffect(() => {
    if (jobs.data) {
      const options = jobs.data.results.map((job) => ({
        title: toCapitalize(job.name),
        value: String(job.id),
      }));
      setJobOptions(options);
    }
  }, [jobs.data]);

  useEffect(() => {
    if (success) {
      imageReset();
      firstNameReset();
      lastNameReset();
      emailReset();
      genderReset();
      addressReset();
      phoneReset();
      stateReset();
      supervisorReset();
      cityReset();
      jobReset();
      departmentReset();
      dobReset();
      dEmployedReset();
    }
  }, [
    success,
    imageReset,
    firstNameReset,
    lastNameReset,
    emailReset,
    genderReset,
    addressReset,
    phoneReset,
    stateReset,
    supervisorReset,
    cityReset,
    jobReset,
    departmentReset,
    dobReset,
    dEmployedReset,
  ]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const form = {
        image: image.value,
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        gender: gender.value,
        address: address.value,
        phone: phone.value,
        state: state.value,
        supervisor: supervisor.value,
        city: city.value,
        job: job.value,
        department: department.value,
        date_of_birth: date_of_birth.value,
        date_employed: date_employed.value,
      };
      onSubmit(e, form);
    },
    [
      onSubmit,
      image.value,
      first_name.value,
      last_name.value,
      email.value,
      gender.value,
      address.value,
      phone.value,
      state.value,
      supervisor.value,
      city.value,
      job.value,
      department.value,
      date_of_birth.value,
      date_employed.value,
    ]
  );

  const imageError =
    typeof formErrors?.image === "string" ?
    formErrors?.image : "";

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <File
              disabled={loading}
              error={imageError || errors?.profile?.image}
              label="Image"
              onChange={image.onChange}
              placeholder="upload image"
              required={editMode ? false : true}
              value={image.value?.name || ""}
            />
          </div>
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.first_name || errors?.user?.first_name || ""}
            label="First Name"
            onChange={first_name.onChange}
            placeholder="First Name"
            required
            value={first_name.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.last_name || errors?.user?.last_name || ""}
            label="Last Name"
            onChange={last_name.onChange}
            placeholder="Last Name"
            required
            value={last_name.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.email || errors?.user?.email || ""}
            label="Email"
            onChange={email.onChange}
            placeholder="Email"
            required
            value={email.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Select
            btn={{
              disabled: departments.isFetching,
              loader: true,
              loading: departments.isFetching,
              onClick: () => {
                if (
                  departments.data &&
                  departments.data.count > departments.data.results.length
                ) {
                  setDepLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
                }
              },
              title: "load more",
            }}
            disabled={departments.isLoading || loading}
            error={
              departmentsError ||
              formErrors?.department ||
              errors?.department?.id ||
              ""
            }
            label="Department"
            onChange={department.onChange}
            placeholder="Select Department"
            options={depOptions}
            required
            value={department.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Select
            btn={{
              disabled: jobs.isFetching,
              loader: true,
              loading: jobs.isFetching,
              onClick: () => {
                if (jobs.data && jobs.data.count > jobs.data.results.length) {
                  setJobLimit((prevState) => prevState + DEFAULT_PAGINATION_SIZE);
                }
              },
              title: "load more",
            }}
            disabled={jobs.isLoading || loading}
            error={jobsError || formErrors?.job || errors?.job?.id || ""}
            label="Job"
            onChange={job.onChange}
            placeholder="Select Job"
            options={jobOptions}
            required
            value={job.value}
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
              employeesError ||
              formErrors?.supervisor ||
              String(errors?.supervisor?.id || "") ||
              ""
            }
            label="Supervisor"
            onChange={supervisor.onChange}
            placeholder="Select Supervisor"
            options={empOptions}
            required={false}
            value={supervisor.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.phone || errors?.profile?.phone || ""}
            label="Phone Number"
            onChange={phone.onChange}
            placeholder="Phone Number"
            required
            value={phone.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Select
            disabled={loading}
            error={formErrors?.gender || errors?.profile?.gender || ""}
            label="Gender"
            onChange={gender.onChange}
            options={[
              { title: "Male", value: "M" },
              { title: "Female", value: "F" },
            ]}
            required
            value={gender.value}
          />
        </div>
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <Textarea
            disabled={loading}
            error={formErrors?.address || errors?.profile?.address || ""}
            label="Address"
            onChange={address.onChange}
            placeholder="Address"
            required
            value={address.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.state || errors?.profile?.state || ""}
            label="State"
            onChange={state.onChange}
            placeholder="State"
            required
            value={state.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.city || errors?.profile?.city || ""}
            label="City"
            onChange={city.onChange}
            placeholder="City"
            required
            value={city.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={
              formErrors?.date_of_birth || errors?.profile?.date_of_birth || ""
            }
            label="Date Of Birth"
            onChange={date_of_birth.onChange}
            placeholder="Date Of Birth"
            required
            type="date"
            value={date_of_birth.value}
          />
        </div>
        <div className="w-full md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.date_employed || errors?.date_employed || ""}
            label="Date Employed"
            onChange={date_employed.onChange}
            placeholder="Date Employed"
            required
            type="date"
            value={date_employed.value}
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
