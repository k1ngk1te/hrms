import { useCallback, useEffect, useState } from "react";
import { isErrorWithData, isFormError } from "../../../store";
import { open as alertModalOpen } from "../../../store/features/alert-modal-slice";
import { useCreateProjectFileMutation } from "../../../store/features/projects-slice";
import { useAppDispatch, useFormInput } from "../../../hooks";
import { validateForm } from "../../../utils";
import { Button, File, Input } from "../../controls";

const AddProjectFileForm = ({ 
  accept = "application/*, image/*",
  project_id, 
  onClose, 
  label,
  type
}: {
  accept?: string;
  label?: string; 
  project_id: string; 
  onClose: () => void;
  type: "application" | "image"
}) => {
	const [formErrors, setFormErrors] = useState<{name?: string; file?: string}>({
		name: undefined, file: undefined
	})

	const dispatch = useAppDispatch();

	const name = useFormInput("", {
		onChange: () => setFormErrors({ ...formErrors, name: undefined })
	})

	const file = useFormInput("", {
		onChange: () => setFormErrors({ ...formErrors, file: undefined})
	})

  const nameReset = name.reset;
  const fileReset = file.reset;

	const [createProjectFile, { error, status, isLoading }] = useCreateProjectFileMutation()

	const handleSubmit = useCallback((form: { name: any; file: any }) => {
		const {valid, result} = validateForm(form, ["name"])
    if (valid && project_id && project_id !== "") {
      const fileType = form.file.type.split("/")[0]
      if (fileType === type) createProjectFile({project_id, data: form})
      else setFormErrors((prevState) => ({...prevState, file: "Invalid file type"}))
    }
		else setFormErrors(result)
	}, [createProjectFile, project_id, type])

	const fileError =
    typeof formErrors?.file === "string" ?
    formErrors?.file : "";

  const errors = isFormError<{name?: string; file?: string;}>(error) ? error.data : undefined

  useEffect(() => {
  	if (isErrorWithData(error) && (error.data.detail || error.data.error)) {
  		dispatch(alertModalOpen({
  			header: "Upload Failed",
  			color: "danger",
  			message: String(error.data.detail || error.data.error || "Unable to upload file")
  		}))
  	}
  }, [error])

  useEffect(() => {
  	if (status === "fulfilled") {
  		dispatch(alertModalOpen({
  			header: "File Added",
  			color: "success",
  			message: "File was added to project successfully"
  		}))
      onClose()
      nameReset()
      fileReset()
  	}
  }, [dispatch, status, nameReset, fileReset, onClose])

	return (
		<form onSubmit={(e) => {
			e.preventDefault()
			handleSubmit({name: name.value, file: file.value})
		}} className="p-4">
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <File
              accept={accept}
              disabled={isLoading}
              error={fileError || errors?.file}
              label={label || "File"}
              onChange={file.onChange}
              placeholder={`upload ${label || "file"}`}
              required
              value={file.value?.name || ""}
            />
          </div>
        </div>
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <Input
          	badge={{
          		bg: "info",
          		title: "optional"
          	}}
            disabled={isLoading}
            error={formErrors?.name || errors?.name || ""}
            label="File Name"
            onChange={name.onChange}
            placeholder="Enter file name"
            required={false}
            value={name.value}
          />
        </div>
      </div>
			<div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={isLoading}
            loader
            loading={isLoading}
            title="upload"
            type="submit"
          />
        </div>
      </div>
		</form>
	)
}

export default AddProjectFileForm