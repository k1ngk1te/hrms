import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { toCapitalize } from "../../utils";
import { JobType } from "../../types/jobs";
import Table, { HeadType, RowType } from "../controls/Table";

const heads: HeadType = [{ value: "name" }, { type: "actions", value: "edit" }];

const getRows = (
  data: JobType[],
  updateJob: (data: { id: number | string; name: string }) => void,
  deleteJob: (id: string | number) => void,
  disableAction: boolean
): RowType[] =>
  data.map((job) => [
    { value: toCapitalize(job.name) || "---" },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          disabled: disableAction,
          Icon: FaPen,
          onClick: () =>
            updateJob({
              id: job.id,
              name: job.name,
            }),
        },
        {
          color: "danger",
          disabled: disableAction,
          Icon: FaTrash,
          onClick: () => deleteJob(job.id),
        },
      ],
    },
  ]);

type TableType = {
  jobs: JobType[];
  loading: boolean;
  updateJob: (data: { id: number | string; name: string }) => void;
  deleteJob: (id: number | string) => void;
  disableAction: boolean;
};

const JobTable = ({
  jobs = [],
  disableAction,
  deleteJob,
  updateJob,
}: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);

  useEffect(() => {
    setRows(getRows(jobs, updateJob, deleteJob, disableAction));
  }, [jobs, updateJob, deleteJob, disableAction]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table heads={heads} rows={rows} />
    </div>
  );
};

export default JobTable;
