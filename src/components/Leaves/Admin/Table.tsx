import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { ADMIN_LEAVE_DETAIL_PAGE_URL } from "../../../config/routes";
import { LeaveType } from "../../../types/leaves";
import { getDate } from "../../../utils";
import Table, { HeadType, RowType } from "../../controls/Table";

const heads: HeadType = [
  { value: "employee name" },
  { value: "type" },
  { value: "start date" },
  { value: "end date" },
  { value: "resumption" },
  { value: "status" },
  { value: "date" },
  { type: "actions", value: "view" },
];

const getRows = (data: LeaveType[]): RowType[] =>
  data.map((leave) => [
    { link: ADMIN_LEAVE_DETAIL_PAGE_URL(leave.id),
      value: leave.user
        ? `${leave.user.first_name} ${leave.user.last_name}`
        : "---",
    },
    { value: leave.leave_type.name || "---" },
    { value: leave.start_date || "---" },
    { value: leave.end_date || "---" },
    { value: leave.resume_date || "---" },
    {
      options: {
        bg:
          leave.admin_status === "approved"
            ? "success"
            : leave.admin_status === "denied"
            ? "error"
            : leave.admin_status === "pending"
            ? "warning"
            : "info",
      },
      type: "badge",
      value: leave.admin_status || "not needed",
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
          link: ADMIN_LEAVE_DETAIL_PAGE_URL(leave.id),
        },
      ],
    },
  ]);

type TableType = {
  leaves: LeaveType[];
  setStatus: (e: "" | "approved" | "denied" | "pending") => void;
};

const LeaveTable = ({ leaves, setStatus }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<
    "all" | "approved" | "denied" | "pending"
  >("all");

  useEffect(() => {
    let finalList;
    if (activeRow === "denied") {
      finalList = leaves.filter((leave) => leave.admin_status === "denied");
    } else if (activeRow === "approved") {
      finalList = leaves.filter((leave) => leave.admin_status === "approved");
    } else if (activeRow === "pending") {
      finalList = leaves.filter((leave) => leave.admin_status === "pending");
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
                setStatus("");
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
                setStatus("approved");
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
                setStatus("denied");
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
                setStatus("pending");
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
