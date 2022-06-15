import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { LEAVE_DETAIL_PAGE_URL } from "../../config/routes";
import { LeaveType } from "../../types/leaves";
import { getDate } from "../../utils";
import Table, { HeadType, RowType } from "../controls/Table";

type Leave = Omit<LeaveType, "user">;

const heads: HeadType = [
  { value: "type" },
  { value: "start date" },
  { value: "end date" },
  { value: "resumption" },
  { value: "days" },
  { value: "status" },
  { value: "date" },
  { type: "actions", value: "view" },
];

const getRows = (data: Leave[]): RowType[] =>
  data.map((leave) => [
    { link: LEAVE_DETAIL_PAGE_URL(leave.id), value: leave.leave_type.name || "---" },
    { value: leave.start_date || "---" },
    { value: leave.end_date || "---" },
    { value: leave.resume_date || "---" },
    { value: leave.no_of_days || "---" },
    {
      options: {
        bg:
          leave.status === "approved"
            ? "success"
            : leave.status === "denied"
            ? "error"
						: leave.status === "expired"
						? "info"
            : "warning",
      },
      type: "badge",
      value: leave.status,
    },
    {
      value: leave.date_requested ? getDate(leave.date_requested, true) : "---",
    },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaEye,
          link: LEAVE_DETAIL_PAGE_URL(leave.id),
        },
      ],
    },
  ]);

type TableType = {
  leaves: Leave[];
};

const LeaveTable = ({ leaves }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<
    "all" | "approved" | "denied" | "pending"
  >("all");

  useEffect(() => {
    let finalList;
    if (activeRow === "denied") {
      finalList = leaves.filter((leave) => leave.status === "denied");
    } else if (activeRow === "approved") {
      finalList = leaves.filter((leave) => leave.status === "approved");
    } else if (activeRow === "pending") {
      finalList = leaves.filter((leave) => leave.status === "pending");
    } else {
      finalList = leaves;
    }
    setRows(getRows(finalList));
  }, [activeRow, leaves]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table
        heads={heads}
        rows={rows}
        split={{
          actions: [
            {
              active: activeRow === "all",
              onClick: () => {
                setRows(getRows(leaves));
                setActiveRow("all");
              },
              title: "all",
            },
            {
              active: activeRow === "approved",
              onClick: () => {
                setRows(
                  getRows(leaves).filter(
                    (row: RowType) => row[5].value === "approved" && row
                  )
                );
                setActiveRow("approved");
              },
              title: "approved",
            },
            {
              active: activeRow === "denied",
              onClick: () => {
                setRows(
                  getRows(leaves).filter(
                    (row: RowType) => row[5].value === "denied" && row
                  )
                );
                setActiveRow("denied");
              },
              title: "denied",
            },
            {
              active: activeRow === "pending",
              onClick: () => {
                setRows(
                  getRows(leaves).filter(
                    (row: RowType) => row[5].value === "pending" && row
                  )
                );
                setActiveRow("pending");
              },
              title: "pending",
            },
          ],
        }}
      />
    </div>
  );
};

export default LeaveTable;
