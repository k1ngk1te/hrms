import { useCallback, useEffect } from "react";
import { isErrorWithData } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useMarkProjectCompletedMutation } from "../../store/features/projects-slice";
import { useAppDispatch } from "../index";

const useMarkProject = () => {
  const dispatch = useAppDispatch();

  const [markProject, { data, error, isLoading, status }] = useMarkProjectCompletedMutation()

  const handleSubmit = useCallback((id: string, action: boolean) => {
	const message = action ? "Mark project as completed?" : "Mark project as ongoing?"

    dispatch(alertModalOpen({
      color: "danger",
      header: "Mark Project?",
      message,
      decisions: [
        {
          bg: "bg-yellow-600 hover:bg-yellow-500",
          caps: true,
          title: "cancel"
        },
        {
          bg: "bg-red-600 hover:bg-red-500",
          caps: true,
          onClick: () => markProject({ id, action }),
          title: "proceed"
        },
      ]
    }))
  }, [markProject, dispatch])

  useEffect(() => {
		if (status === "fulfilled" && data !== undefined) {
			dispatch(alertModalOpen({
				color: "success",
				header: "Project Updated",
				message: String(data?.detail || "Project was updated successfully")
			}))
		}
	}, [dispatch, data, status])

  useEffect(() => {
    if (isErrorWithData(error)) {
      dispatch(alertModalOpen({
        header: "Failed to update project.",
        message: String(error.data?.detail || error.data?.error || "A server error occurred!"),
        color: "danger"
      }))
    }
  }, [dispatch, error])

  return {
    success: status === "fulfilled" ? true : status === "rejected" ? false : undefined,
    isLoading,
    onSubmit: handleSubmit,
  }
}

export default useMarkProject
