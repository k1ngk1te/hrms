import { useCallback, useEffect, useState } from "react";
import { isErrorWithData } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useDeleteProjectMutation } from "../../store/features/projects-slice";
import { useAppDispatch } from "../index";

const useDeleteProject = () => {
  const dispatch = useAppDispatch();

  const [success, setSuccess] = useState(false);

  const [deleteProject, { error, isLoading, status }] = useDeleteProjectMutation()

  const reset = useCallback(() => {
    setSuccess(false)
  }, [])

  const handleSubmit = useCallback((id: string) => {
    dispatch(alertModalOpen({
      color: "danger",
      header: "Delete Project?",
      message: "Do you wish to delete this project?",
      decisions: [
        {
          bg: "bg-yellow-600 hover:bg-yellow-500",
          caps: true,
          title: "cancel"
        },
        {
          bg: "bg-red-600 hover:bg-red-500",
          caps: true,
          onClick: () => deleteProject(id),
          title: "proceed"
        },
      ]
    }))
  }, [deleteProject, dispatch])

  useEffect(() => {
    setSuccess(false)
  }, [isLoading])

  useEffect(() => {
		if (status === "fulfilled") {
      setSuccess(true);
			dispatch(alertModalOpen({
				color: "warning",
				header: "Project Deleted",
				message: "Project was deleted successfully"
			}))
		}
	}, [dispatch, status])

  useEffect(() => {
    if (error) setSuccess(false);
    if (isErrorWithData(error)) {
      dispatch(alertModalOpen({
        header: "Failed to delete project.",
        message: String(error.data?.detail || error.data?.error || "A server error occurred!"),
        color: "danger"
      }))
    }
  }, [dispatch, error])

  return {
    success: success && status === "fulfilled" ? true : status === "rejected" ? false : undefined,
    isLoading,
    onSubmit: handleSubmit,
    reset
  }
}

export default useDeleteProject
