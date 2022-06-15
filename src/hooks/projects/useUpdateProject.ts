import { useCallback, useEffect, useState } from "react";
import { isErrorWithData, isFormError } from "../../store";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import { useUpdateProjectMutation } from "../../store/features/projects-slice";
import { useAppDispatch } from "../index";
import { ProjectCreateType, ProjectCreateErrorType } from "../../types/employees";

const useUpdateProject = () => {
  const dispatch = useAppDispatch();

  const [success, setSuccess] = useState(false);

  const [updateProject, { error, isLoading, status }] = useUpdateProjectMutation()

  const handleSubmit = useCallback((id: string, data: ProjectCreateType) => {
    updateProject({id, data})
  }, [updateProject])

  const reset = useCallback(() => {
    setSuccess(false)
  }, [])

  useEffect(() => {
    setSuccess(false)
  }, [isLoading])

  useEffect(() => {
		if (status === "fulfilled") {
      setSuccess(true);
			dispatch(alertModalOpen({
				color: "success",
				header: "Project Updated",
				message: "Project was updated successfully"
			}))
		}
	}, [dispatch, status])

  useEffect(() => {
    if (error) setSuccess(false)
    if (isErrorWithData(error)) {
      dispatch(alertModalOpen({
        header: "Failed to update project.",
        message: String(error.data?.detail || error.data?.error || "A server error occurred!"),
        color: "danger"
      }))
    }
  }, [dispatch, error])

  return {
    error: isFormError<ProjectCreateErrorType>(error) ? error : undefined,
    success: success && status === "fulfilled" ? true : status === "rejected" ? false : undefined,
    isLoading,
    onSubmit: handleSubmit,
    reset
  }
}

export default useUpdateProject
