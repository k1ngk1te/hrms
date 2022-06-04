import { useCallback, useEffect } from "react"
import { isErrorWithData, isFormError } from "../../store";
import { logout } from "../../store/features/auth-slice"
import { close as modalClose } from "../../store/features/modal-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useUpdateTaskMutation } from "../../store/features/projects-slice";
import { useAppDispatch } from "../index"
import { TaskCreateType, TaskCreateErrorType } from "../../types/employees";

const useUpdateTask = () => {
	const dispatch = useAppDispatch();

	const [updateTask, { error, status, isLoading }] = useUpdateTaskMutation()

	const handleSubmit = useCallback((
		project_id: string,
		id: string,
		data: TaskCreateType
	) => {
		updateTask({project_id, id, data})
	}, [updateTask])

	useEffect(() => {
		if (error && isErrorWithData(error)) {
			if (error.status === 401) dispatch(logout())
			dispatch(alertModalOpen({
				color: "danger",
				header: "Update Failed",
				message: String(error.data.detail || error.data.error || "A server error occurred")
			}))
		}
	}, [dispatch, error])

	return {
		error: isFormError<TaskCreateErrorType>(error) ? error.data : undefined,
		success: status === "fulfilled" ? true : status === "rejected" ? false : undefined,
		isLoading,
		onSubmit: handleSubmit
	}
}

export default useUpdateTask;
