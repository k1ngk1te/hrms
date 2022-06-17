import { FormEvent, FC, useCallback, useEffect } from "react";
import { useFormInput } from "../../hooks";
import { Button, Input } from "../controls";

type FormType = {
  name: string;
};

type ErrorType = {
  name?: string;
};

type FormProps = {
  initState: FormType;
  editMode?: boolean;
  errors?: ErrorType;
  nameError?: string;
  loading: boolean;
  success?: boolean;
  onSubmit: (form: FormType) => void;
};

const Form: FC<FormProps> = ({
  initState,
  editMode,
  errors,
  nameError,
  loading,
  success,
  onSubmit,
}) => {
  const name = useFormInput(initState?.name || "");
  const reset = name.reset;  

  useEffect(() => {
    if (success) reset()
  }, [reset, success])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      onSubmit({ name: name.value });
    },
    [onSubmit, name.value]
  );

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        <div className="w-full md:col-span-2">
          <Input
            disabled={loading}
            error={errors?.name || nameError || ""}
            label="Job Name"
            required
            onChange={name.onChange}
            placeholder="Enter Name Of Job"
            value={name.value}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            caps
            disabled={loading}
            loader
            loading={loading}
            title={editMode ? "update job" : "add job"}
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
