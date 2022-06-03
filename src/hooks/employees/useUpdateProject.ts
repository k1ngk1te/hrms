import { useCallback, useEffect } from "react";
import { isErrorWithData, isFormError } from "@/store";
import { open as alertModalOpen } from "@/store/features/alert-modal-slice";
import { useUpdateProjectMutation } from "@/store/features/projects-slice";
import { useAppDispatch } from "@/hooks";
import { ProjectCreateType, ProjectCreateErrorType } from "@/types/employees";

const useUpdateProject = () => {
  const dispatch = useAppDispatch();

  const [updateProject, { error, isLoading, status }] = useUpdateProjectMutation()

  const handleSubmit = useCallback((id: string, data: ProjectCreateType) => {
    updateProject({id, data})
  }, [updateProject])

  useEffect(() => {
		if (status === "fulfilled") {
			dispatch(alertModalOpen({
				color: "success",
				header: "Project Updated",
				message: "Project was updated successfully"
			}))
		}
	}, [dispatch, status])

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
    error: isFormError<ProjectCreateErrorType>(error) ? error : undefined,
    success: status === "fulfilled" ? true : status === "rejected" ? false : undefined,
    isLoading,
    onSubmit: handleSubmit,
  }
}

export default useUpdateProject
