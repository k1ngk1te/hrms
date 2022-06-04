import { FC, FormEvent, useCallback, useEffect } from "react";
import { useFormInput } from "../../hooks";
import { Button, Input } from "../controls";
import { HolidayCreateType, HolidayErrorType } from "../../types/employees";

type FormProps = {
	initState: HolidayCreateType;
	errors?: HolidayErrorType;
	loading: boolean;
	onSubmit: (e: HolidayCreateType) =>void;
	editMode?: boolean;
	success?: boolean;
}

const Form: FC<FormProps> = ({ editMode=false, success, loading, onSubmit, errors, initState }) => {

  const name = useFormInput(initState.name || "");
  const date = useFormInput(initState.date || "");

  const nameReset = name.reset;
  const dateReset = date.reset;

  useEffect(() => {
    if (success === true && !editMode) {
      nameReset();
      dateReset();
    }
  }, [nameReset, dateReset, success]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>, data: HolidayCreateType) => {
      e.preventDefault();

      onSubmit(data)

    },	
    [onSubmit]
  );

  return (
    <form onSubmit={(e) => {
    	handleSubmit(e, {
    		name: name.value,
    		date: date.value
    	})
    }} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:gap-4 lg:gap-6">
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors?.name || ""}
            label="Name"
            onChange={name.onChange}
            placeholder="Enter the name of the holiday"
            required
            value={name.value}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors?.date || ""}
            label="Date"
            onChange={date.onChange}
            placeholder="Enter the holiday date"
            required
            type="date"
            value={date.value}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={loading}
            loader
            loading={loading}
            title={editMode ? "update holiday" : "add holiday"}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
