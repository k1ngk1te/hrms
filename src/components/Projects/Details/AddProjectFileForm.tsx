import { useCreateProjectFileMutation } from "../../../store/features/projects-slice";
import { Button, File, Input } from "../../controls";

const AddProjectFileForm = () => {
	return (
		<form className="p-4">
			<div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-6">
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <File
              disabled={loading}
              error={imageError || errors?.profile?.image}
              label="Image"
              onChange={image.onChange}
              placeholder="upload image"
              required={editMode ? false : true}
              value={image.value?.name || ""}
            />
          </div>
        </div>
        <div className="w-full md:col-span-2 md:flex md:flex-col md:justify-end">
          <Input
            disabled={loading}
            error={formErrors?.first_name || errors?.user?.first_name || ""}
            label="File Name"
            onChange={first_name.onChange}
            placeholder="File Name"
            required
            value={first_name.value}
          />
        </div>
      </div>
			<div className="flex items-center justify-center my-4 sm:my-5 md:mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3">
          <Button
            disabled={loading}
            loader
            loading={loading}
            title="submit"
            type="submit"
          />
        </div>
      </div>
		</form>
	)
}

export default AddProjectFileForm