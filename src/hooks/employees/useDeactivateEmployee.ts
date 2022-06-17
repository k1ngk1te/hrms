import { useCallback, useEffect } from "react";
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice";
import { open } from "../../store/features/alert-modal-slice";
import { useDeactivateEmployeeMutation } from "../../store/features/employees-slice";
import { useAppDispatch } from "../index";
import { toCapitalize } from "../../utils";

const useDeactivateEmployee = (
	form_type: "client" | "employee" = "employee"
) => {
	const dispatch = useAppDispatch();

	const [
		deactivateEmployee,
		{ data, error, status, isLoading },
	] = useDeactivateEmployeeMutation();

	const handleDeactivateEmployee = useCallback(
		(email: string, userActive: boolean) => {
			dispatch(
				open({
					color: userActive ? "danger" : "success",
					header: userActive
						? `Deactivate ${toCapitalize(form_type || "")}`
						: `Activate ${toCapitalize(form_type || "")}`,
					message: userActive
						? `Deactivating this ${form_type} will make this him/her unable to perform any action on this application.\n Use this instead of deleting the ${form_type}.`
						: `Activating this ${form_type} will allow him/her to login and perform some basic actions on this applications`,
					decisions: [
						{
							color: "info",
							title: "Cancel",
						},
						{
							onClick: () => {
								if (email) {
									deactivateEmployee({
										email,
										action: userActive ? "deactivate" : "activate",
										type: form_type || "employee",
									});
								}
							},
							color: userActive ? "danger" : "success",
							title: "Proceed",
						},
					],
				})
			);
		},
		[deactivateEmployee, dispatch]
	);

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(
				open({
					color: "success",
					header: "Action Completed Successfully",
					message: data?.detail || "Completed Successfully!",
				})
			);
		} else if (status === "rejected" && isErrorWithData(error)) {
			if (error?.status === 401) dispatch(logout());
			else
				dispatch(
					open({
						color: "danger",
						header: "Action Failed",
						message: String(
							error.data?.detail ||
								error.data?.error ||
								"Completed Successfully!"
						),
					})
				);
		}
	}, [dispatch, data, error, status]);

	return {
		loading: isLoading,
		deactivate: handleDeactivateEmployee,
	};
};

export default useDeactivateEmployee;
