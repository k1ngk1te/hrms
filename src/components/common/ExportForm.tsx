import { FC, useState } from "react";
import { Button, Select } from "../controls";

type FormProps = {
  onSubmit: (type: any, filter: boolean) => void;
};

const Form: FC<FormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    type: "csv",
    employees: "all",
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form.type, form.employees === "all" ? false : true,);
      }}
      className="p-2 w-full"
    >
      <div className="mb-2 w-full">
        <Select
          label="Type"
          name="type"
          options={[
            { title: "CSV", value: "csv" },
            { title: "Excel", value: "excel" },
          ]}
          onChange={(e) =>
            setForm((prevState) => ({ ...prevState, type: e.target.value }))
          }
          padding="px-3 py-1"
          required
          rounded="rounded-lg"
          value={form.type}
        />
      </div>
      <div className="mb-2 w-full">
        <Select
          label="Employees"
          name="employees"
          options={[
            { title: "All", value: "all" },
            { title: "Filtered", value: "filtered" },
          ]}
          onChange={(e) =>
            setForm((prevState) => ({
              ...prevState,
              employees: e.target.value,
            }))
          }
          padding="px-3 py-1"
          required
          rounded="rounded-lg"
          value={form.employees}
        />
      </div>
      <div className="mt-4 mb-2 w-full">
        <Button
          caps
          padding="px-4 py-1"
          rounded="rounded-lg"
          type="submit"
          title="export"
        />
      </div>
    </form>
  );
};

export default Form;
