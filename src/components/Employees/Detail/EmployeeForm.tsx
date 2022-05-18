import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { isErrorWithData } from "@/store";
import { logout } from "@/store/features/auth-slice";
import { open as alertModalOpen } from "@/store/features/alert-modal-slice";
import { close as modalClose } from "@/store/features/modal-slice";
import { useUpdateEmployeeMutation } from "@/store/features/employees-slice";
import { useAppDispatch } from "@/hooks";
import { omitKey, validateForm } from "@/utils";
import { initErrorState } from "@/containers/Employees";
import { EmployeeType, ErrorFormType, FormType } from "@/types/employees";
import { Form } from "@/components/Employees";

const EmployeeForm = ({
  empId,
  data,
}: {
  empId: number | string;
  data?: EmployeeType;
}) => {
  const [errors, setErrors] = useState<ErrorFormType>(initErrorState);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [updateEmployee, { error, status }] = useUpdateEmployeeMutation();

  const initState: FormType = {
    image: undefined,
    first_name: data?.user.first_name || "",
    last_name: data?.user.last_name || "",
    email: data?.user.email || "",
    department: String(data?.department?.id) || "",
    job: String(data?.job?.id) || "",
    supervisor: String(data?.supervisor) || "",
    date_employed: data?.date_employed || "",
    date_of_birth: data?.profile?.date_of_birth || "",
    gender: data?.profile?.gender.value || "M",
    state: data?.profile?.state || "",
    city: data?.profile?.city || "",
    phone: data?.profile?.phone || "",
    address: data?.profile?.address || "",
  };

  useEffect(() => {
    if (status !== "pending") setLoading(false);
    if (status === "fulfilled") {
      dispatch(modalClose());
      dispatch(
        alertModalOpen({
          color: "success",
          decisions: [
            {
              color: "success",
              title: "OK",
            },
          ],
          Icon: FaCheckCircle,
          header: "Employee Updated",
          message: "Employee information was updated successfully!",
        })
      );
    }
    if (status === "rejected" && isErrorWithData(error)) {
      if (error.status === 401) dispatch(logout())
    }
  }, [dispatch, status, error]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>, form: FormType) => {
      e.preventDefault();
      setLoading(true);
      const omitForm = omitKey(form, ["image"]);
      const { valid, result } = validateForm(omitForm);
      if (valid) {
        updateEmployee({
          employee: {
            ...form,
            email: form.email.toLowerCase(),
          },
          id: empId,
        });
      } else if (valid === false) {
        setErrors(result);
        setLoading(false);
      }
    },
    [dispatch, empId, updateEmployee]
  );

  return (
    <Form
      editMode
      initState={initState}
      errors={error && isErrorWithData(error) ? error.data : undefined}
      formErrors={errors}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default EmployeeForm;
