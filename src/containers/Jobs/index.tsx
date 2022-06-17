import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaPlus, FaSearch, FaTimesCircle, FaUserPlus } from "react-icons/fa";
import { isErrorWithData, isFormError } from "../../store";
import {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "../../store/features/jobs-slice";
import { logout } from "../../store/features/auth-slice";
import { open as alertModalOpen } from "../../store/features/alert-modal-slice";
import {
  close as modalClose,
  open as modalOpen,
} from "../../store/features/modal-slice";
import { useAppDispatch, useAppSelector, useFormInput } from "../../hooks";
import { omitKey, validateForm } from "../../utils";
import { Container, Modal } from "../../components/common";
import { Button, InputButton } from "../../components/controls";
import { Form, JobTable } from "../../components/Jobs";

const Jobs = () => {
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [initState, setInitState] = useState({ name: "" });
  const [editMode, setEditMode] = useState(false);
  const [nameError, setNameError] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [nameSearch, setNameSearch] = useState("");

  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.auth.data);
  const modalVisible = useAppSelector((state) => state.modal.visible);

  const search = useFormInput("");

  const { data, error, isLoading, isFetching, refetch } = useGetJobsQuery({
    limit: 50,
    offset,
    search: nameSearch,
  });
  const [createJob, createData] = useCreateJobMutation();
  const [deleteJob, deleteData] = useDeleteJobMutation();
  const [updateJob, updateData] = useUpdateJobMutation();

  useEffect(() => {
    const e1 = isErrorWithData(error) && error?.status === 401;
    const e2 = isErrorWithData(createData.error) &&
      createData.error?.status === 401;
    const e3 = isErrorWithData(deleteData.error) &&
      deleteData.error?.status === 401;
    const e4 = isErrorWithData(updateData.error) &&
      updateData.error?.status === 401;

    if (e1 === true || e2 === true || e3 === true || e4 === true)
      dispatch(logout());
  }, [dispatch, error, createData.error, deleteData.error, updateData.error]);

  useEffect(() => {
    if (search.value == "") setNameSearch("");
  }, [search.value]);

  useEffect(() => {
    if (editMode === true && updateData.status === "fulfilled") {
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
          header: "Job Updated",
          message: "Job Updated Successfully.",
        })
      );
    }
  }, [dispatch, editMode, updateData.status]);

  useEffect(() => {
    if (deleteData.status === "fulfilled") {
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
          header: "Job Deleted",
          message: "Job Deleted Successfully.",
        })
      );
    }
  }, [dispatch, deleteData.status]);

  useEffect(() => {
    if (editMode === false && createData.status === "fulfilled") {
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
          header: "Job Created",
          message: "Job Created Successfully.",
        })
      );
    }
  }, [dispatch, editMode, createData.status]);

  const handleSubmit = useCallback(
    (form: { name: string }) => {
      const { valid, result }: { valid: boolean; result: any } =
        validateForm(form);
      if (valid) {
        if (editMode && editId) updateJob({ id: editId, name: form.name });
        else if (editMode === false) createJob({ name: form.name });
      } else setNameError(result?.name || "This field has an error");
    },
    [editMode, editId, createJob, updateJob]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(
        alertModalOpen({
          color: "warning",
          decisions: [
            {
              color: "danger",
              onClick: () => deleteJob(id),
              title: "Confirm",
            },
            {
              color: "info",
              title: "Cancel",
            },
          ],
          Icon: FaCheckCircle,
          header: "Delete Job?",
          message: "Do you want to delete this Job?.",
        })
      );
    },
    [dispatch, deleteJob]
  );

  return (
    <Container
      heading="Jobs"
      refresh={{
        loading: isFetching,
        onClick: () => refetch(),
      }}
      error={isErrorWithData(error) ? {
        statusCode: error.status || 500,
        title: String(error.data?.detail || error.data?.error || "")
      } : undefined}
      disabledLoading={!isLoading && isFetching}
      loading={isLoading}
      paginate={data ? {
      	loading: isFetching, offset, setOffset,
      	totalItems: data.count || 0
      } : undefined}
    >
      <div className="flex flex-col md:flex-row md:items-center md:px-2 lg:px-4">
        <form
          className="flex items-center mb-3 pr-8 w-full lg:mb-0"
          onSubmit={(e) => {
            e.preventDefault();
            setNameSearch(search.value.toLowerCase());
          }}
        >
          <InputButton
            buttonProps={{
              disabled: isFetching,
              title: "Search",
              type: "submit",
            }}
            inputProps={{
              bdrColor: "border-primary-500",
              Icon: FaSearch,
              onChange: search.onChange,
              placeholder: "Search Jobs",
              rounded: "rounded-l-lg",
              value: search.value,
            }}
          />
        </form>
        {(authData?.admin_status === "hr" ||
          authData?.admin_status === "md") && (
          <div className="flex w-full lg:justify-end">
            <div className="w-1/2">
              <Button
                bold="normal"
                caps
                onClick={() => {
                  setEditMode(false);
                  setInitState({ name: "" });
                  dispatch(modalOpen());
                }}
                IconRight={FaPlus}
                rounded="rounded-lg"
                title="Add Job"
              />
            </div>
          </div>
        )}
      </div>
      <JobTable
        jobs={data?.results || []}
        updateJob={(id: string, form: { name: string }) => {
          setEditId(id);
          setInitState(form);
          dispatch(modalOpen());
          setEditMode(true);
        }}
        disableAction={deleteData.isLoading}
        deleteJob={(id: string) => handleDelete(id)}
      />
      <Modal
        close={() => dispatch(modalClose())}
        component={
          <Form
            editMode={editMode}
            nameError={nameError}
            initState={initState}
            onSubmit={handleSubmit}
            errors={
              editMode
                ? isFormError<{
                	name?: string;
                }>(updateData.error) ?
                  updateData.error?.data : undefined
                : isFormError<{
                	name?: string;
                }>(createData.error) ?
                  createData.error?.data : undefined
            }
            loading={editMode ? updateData.isLoading : createData.isLoading}
            success={createData.status === "fulfilled"}
          />
        }
        description={
          editMode ? "Update Job" : "Fill in the form below to add a job"
        }
        keepVisible
        title={editMode ? "Update Job" : "Add Job"}
        visible={modalVisible}
      />
    </Container>
  );
};

export default Jobs;
