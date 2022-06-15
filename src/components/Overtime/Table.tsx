import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { OVERTIME_DETAIL_PAGE_URL } from "../../config/routes";
import { OvertimeType } from "../../types/leaves";
import { getDate } from "../../utils";
import Table, { HeadType, RowType } from "../controls/Table";

type Overtime = Omit<OvertimeType, "user">;

const heads: HeadType = [
  { value: "type" },
  { value: "date" },
  { value: "hours" },
  { value: "status" },
  { value: "date requested" },
  { type: "actions", value: "view" },
];

const getRows = (data: Overtime[]): RowType[] =>
  data.map((ovt) => [
    { link: OVERTIME_DETAIL_PAGE_URL(ovt.id), value: ovt.overtime_type.name || "---" },
    { value: ovt.date || "---" },
    { value: ovt.hours || "---" },
    {
      options: {
        bg:
          ovt.status === "approved"
            ? "success"
            : ovt.status === "denied"
            ? "error"
						: ovt.status === "expired"
						? "info"
            : "warning",
      },
      type: "badge",
      value: ovt.status,
    },
    {
      value: ovt.date_requested ? getDate(ovt.date_requested, true) : "---",
    },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaEye,
          link: OVERTIME_DETAIL_PAGE_URL(ovt.id),
        },
      ],
    },
  ]);

type TableType = {
  overtime: Overtime[];
};

const OvertimeTable = ({ overtime }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<
    "all" | "approved" | "denied" | "pending"
  >("all");

  useEffect(() => {
    let finalList;
    if (activeRow === "denied") {
      finalList = overtime.filter((ovt) => ovt.status === "denied");
    } else if (activeRow === "approved") {
      finalList = overtime.filter((ovt) => ovt.status === "approved");
    } else if (activeRow === "pending") {
      finalList = overtime.filter((ovt) => ovt.status === "pending");
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
              },
              title: "all",
            },
            {
              active: activeRow === "approved",
              onClick: () => {
                setRows(
                  getRows(overtime).filter(
                    (row: RowType) => row[3].value === "approved" && row
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
                  getRows(overtime).filter(
                    (row: RowType) => row[3].value === "denied" && row
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
                  getRows(overtime).filter(
                    (row: RowType) => row[3].value === "pending" && row
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

export default OvertimeTable;
