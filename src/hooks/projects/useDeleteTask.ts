import { useCallback, useEffect } from "react"
import { isErrorWithData } from "../../store";
import { logout } from "../../store/features/auth-slice"
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useDeleteTaskMutation } from "../../store/features/projects-slice";
import { useAppDispatch } from "../index"

const useDeleteTask = () => {
	const dispatch = useAppDispatch();

	const [deleteTask, { error, status, isLoading }] = useDeleteTaskMutation()

	const handleSubmit = useCallback((
		project_id: string,
		id: string
	) => {
		dispatch(alertModalOpen({
      color: "danger",
      header: "Delete Task?",
      message: "Do you wish to delete this task?",
      decisions: [
        {
          bg: "bg-yellow-600 hover:bg-yellow-500",
          caps: true,
          title: "cancel"
        },
        {
          bg: "bg-red-600 hover:bg-red-500",
          caps: true,
          onClick: () => deleteTask({project_id, id}),
          title: "proceed"
        },
      ]
    }))
	}, [dispatch, deleteTask])

	useEffect(() => {
		if (error && isErrorWithData(error)) {
			if (error.status === 401) dispatch(logout())
			dispatch(alertModalOpen({
				color: "danger",
				header: "Delete Failed",
				message: String(error.data.detail || error.data.error || "A server error occurred")
			}))
		}
	}, [dispatch, error])

	useEffect(() => {
		if (status === "fulfilled") {
			dispatch(alertModalOpen({
				color: "info",
				header: "Delete Successful",
				message: "Task Deleted Successfully"
			}))
		}
	}, [status])

	return {
		error: isErrorWithData(error) ? error.data : undefined,
		success: status === "fulfilled" ? true : status === "rejected" ? false : undefined,
		isLoading,
		onSubmit: handleSubmit
	}
}

export default useDeleteTask;
