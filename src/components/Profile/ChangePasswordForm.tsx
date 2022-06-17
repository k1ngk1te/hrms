import { useCallback, useEffect, useState } from "react";

import { logout } from "../../store/features/auth-slice";
import { isErrorWithData, isFormError } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useChangePasswordMutation } from "../../store/features/auth-api-slice";
import { close as modalClose } from "../../store/features/modal-slice";
import { useAppDispatch, useFormInput } from "../../hooks";
import { validateForm } from "../../utils";
import { Button, Input } from "../controls";

const Form = () => {
  const [formErrors, setErrors] = useState<any>({});

  const password1 = useFormInput("");
  const password2 = useFormInput("");

  const password1Reset = password1.reset;
  const password2Reset = password2.reset;

  const dispatch = useAppDispatch();

  const [changePassword, { data, error, isLoading, status }] = useChangePasswordMutation();
  const errors = isFormError<{
  	new_password1?: string; new_password2?: string;
  }>(error) ? error.data : undefined

  useEffect(() => {
    if (status === "fulfilled") {
      dispatch(modalClose());
      dispatch(
        alertModalOpen({
          color: "success",
          header: "Password Changed",
          message: data?.detail || "Password Changed Successfully!",
        })
      );
      password1Reset();
      password2Reset();
    }
  }, [dispatch, data, status, password1Reset, password2Reset]);

  useEffect(() => {
    if (isErrorWithData(error) && error.status === 401) dispatch(logout())
  }, [error, dispatch])

  const handleSubmit = useCallback((data: {password1: string; password2: string;}) => {
    const { valid, result } = validateForm(data);
    if (valid) changePassword(data);
    else setErrors(result);
  },
    [changePassword]
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit({
        password1: password1.value,
        password2: password2.value,
      })
    }} className="p-4">
      <div className="gap-2 grid grid-cols-1 md:gap-4 lg:gap-6">
        <div className="w-full">
          <Input
            disabled={isLoading}
            error={formErrors?.password1 || errors?.new_password1 || ""}
            label="Enter New Password"
            onChange={password1.onChange}
            placeholder="Enter New Password"
            required
						type="password"
            value={password1.value}
          />
        </div>
        <div className="w-full">
          <Input
            disabled={isLoading}
            error={formErrors?.password2 || errors?.new_password2 || ""}
            label="Confirm New Password"
            onChange={password2.onChange}
            placeholder="Enter New Password Again"
            required
						type="password"
            value={password2.value}
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={isLoading}
            loader
            loading={isLoading}
            title="submit"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
