import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { EMPLOYEE_PAGE_URL } from "../../config/routes";
import { EmployeeType } from "../../types/employees";
import Table, { HeadType, RowType } from "../controls/Table";

const heads: HeadType = [
  { value: "first name" },
  { value: "last name" },
  { value: "email" },
  { value: "department" },
  { value: "status" },
  { value: "date employed" },
  { type: "actions", value: "view" },
];

const getRows = (data: EmployeeType[]): RowType[] =>
  data.map((employee) => [
    { link: EMPLOYEE_PAGE_URL(employee.id), value: employee.user.first_name || "---" },
    { value: employee.user.last_name || "---" },
    { value: employee.user.email || "---" },
    { value: employee.department?.name || "---" },
    {
      options: {
        bg:
          employee.status === "active"
            ? "success"
            : employee.status === "on leave"
            ? "warning"
            : "error",
      },
      type: "badge",
      value: employee.status,
    },
    {
      value: employee.date_employed
        ? new Date(employee.date_employed).toLocaleDateString()
        : "---",
    },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaEye,
          link: EMPLOYEE_PAGE_URL(employee.id),
        },
      ],
    },
  ]);

type TableType = {
  employees: EmployeeType[];
  setStatus: (e: "" | "active" | "on leave" | "inactive") => void
};

const EmployeeTable = ({ employees, setStatus }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const [activeRow, setActiveRow] = useState<"all" | "active" | "on leave" | "inactive">(
    "all"
  );

  useEffect(() => {
    let finalList;
    if (activeRow === "on leave") {
      finalList = employees.filter(
        (employee) => employee.status === "on leave"
      );
    } else if (activeRow === "active") {
      finalList = employees.filter((employee) => employee.status === "active");
    } else if (activeRow === "inactive") {
      finalList = employees.filter((employee) => employee.status === "inactive");
    } else {
      finalList = employees;
    }
    setRows(getRows(finalList));
  }, [activeRow, employees]);

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
                setRows(getRows(employees));
                setActiveRow("all");
                setStatus("")
              },
              title: "all",
            },
            {
              active: activeRow === "active",
              onClick: () => {
                setRows(
                  getRows(employees).filter(
                    (row: RowType) => row[4].value === "active" && row
                  )
                );
                setStatus("active");
                setActiveRow("active");
              },
              title: "active",
            },
            {
              active: activeRow === "on leave",
              onClick: () => {
                setRows(
                  getRows(employees).filter(
                    (row: RowType) => row[4].value === "on leave" && row
                  )
                );
                setStatus("on leave")
                setActiveRow("on leave");
              },
              title: "on leave",
            },
            {
              active: activeRow === "inactive",
              onClick: () => {
                setRows(
                  getRows(employees).filter(
                    (row: RowType) => row[4].value === "inactive" && row
                  )
                );
                setStatus("inactive")
                setActiveRow("inactive");
              },
              title: "inactive",
            },
          ],
        }}
      />
    </div>
  );
};

export default EmployeeTable;
