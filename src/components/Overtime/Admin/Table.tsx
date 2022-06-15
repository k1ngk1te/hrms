import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { ADMIN_OVERTIME_DETAIL_PAGE_URL } from "../../../config/routes";
import { OvertimeType } from "../../../types/leaves";
import { getDate } from "../../../utils";
import Table, { HeadType, RowType } from "../../controls/Table";

const heads: HeadType = [
  { value: "employee name" },
  { value: "type" },
  { value: "date" },
  { value: "hours" },
  { value: "status" },
  { value: "date requested" },
  { type: "actions", value: "view" },
];

const getRows = (data: OvertimeType[]): RowType[] =>
  data.map((overtime) => [
    {
      link: ADMIN_OVERTIME_DETAIL_PAGE_URL(overtime.id),
      value: overtime.user
        ? `${overtime.user.first_name} ${overtime.user.last_name}`
        : "---",
    },
    { value: overtime.overtime_type.name || "---" },
    { value: overtime.date || "---" },
    { value: overtime.hours || "---" },
    {
      options: {
        bg:
          overtime.admin_status === "approved"
            ? "success"
            : overtime.admin_status === "denied"
            ? "error"
            : overtime.admin_status === "pending"
            ? "warning"
            : "info",
      },
      type: "badge",
      value: overtime.admin_status || "not needed",
    },
    {
      value: overtime.date_requested ? getDate(overtime.date_requested, true) : "---",
    },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaEye,
          link: ADMIN_OVERTIME_DETAIL_PAGE_URL(overtime.id),
        },
      ],
    },
  ]);

type TableType = {
  overtime: OvertimeType[];
  setStatus: (e: "" | "approved" | "denied" | "pending") => void;
};

const OvertimeTable = ({ overtime, setStatus }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<
    "all" | "approved" | "denied" | "pending"
  >("all");

  useEffect(() => {
    let finalList;
    if (activeRow === "denied") {
      finalList = overtime.filter((ovt) => ovt.admin_status === "denied");
    } else if (activeRow === "approved") {
      finalList = overtime.filter((ovt) => ovt.admin_status === "approved");
    } else if (activeRow === "pending") {
      finalList = overtime.filter((ovt) => ovt.admin_status === "pending");
    } else {
      finalList = overtime;
    }
    setRows(getRows(finalList));
  }, [activeRow, overtime]);

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
                setRows(getRows(overtime));
                setActiveRow("all");
                setStatus("");
              },
              title: "all",
            },
            {
              active: activeRow === "approved",
              onClick: () => {
                setRows(
                  getRows(overtime).filter(
                    (row: RowType) => row[4].value === "approved" && row
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
                  getRows(overtime).filter(
                    (row: RowType) => row[4].value === "denied" && row
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
                  getRows(overtime).filter(
                    (row: RowType) => row[4].value === "pending" && row
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

export default OvertimeTable;
