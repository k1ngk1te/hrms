import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useAppSelector } from "../../hooks";
import { toCapitalize } from "../../utils";
import { DepartmentType } from "../../types/departments";
import Table, { HeadType, RowType } from "../controls/Table";

const getRows = (
  data: DepartmentType[],
  updateDep: (data: { id: string; name: string; hod: string }) => void,
  adminStatus: "hr" | "md" | "supervisor" | "hod" | null | undefined,
  deleteDep: (id: string) => void,
  disableAction: boolean
): RowType[] =>
  data.map((department) => {
    let result: RowType = [
      { value: department.name || "---" },
      {
        value: department?.hod
          ? department?.hod.full_name
          : "---",
      },
      { value: department?.no_of_employees || "---" },
    ];
    if (adminStatus && (adminStatus === "hr" || adminStatus === "md"))
      result = [
        ...result,
        {
          type: "actions",
          value: [
            {
              color: "primary",
              disabled: disableAction,
              Icon: FaPen,
              onClick: () =>
                updateDep({
                  id: department.id,
                  name: toCapitalize(department.name),
                  hod: department.hod ? String(department.hod.id) : "",
                }),
            },
            {
              color: "danger",
              disabled: disableAction,
              Icon: FaTrash,
              onClick: () => deleteDep(department.id),
            },
          ],
        },
      ];
    return result;
  });

type TableType = {
  departments: DepartmentType[];
  updateDep: (data: { id: string; name: string; hod: string }) => void;
  deleteDep: (id: string) => void;
  disableAction: boolean;
};

const DepartmentTable = ({
  departments = [],
  deleteDep,
  disableAction,
  updateDep,
}: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);
  const authData = useAppSelector((state) => state.auth.data);

  let heads: HeadType = [
    { value: "name" },
    { value: "head of department" },
    { value: "no. of employees" },
  ];

  if (authData?.admin_status === "hr" || authData?.admin_status === "md")
    heads = [...heads, { type: "actions", value: "edit" }];

  useEffect(() => {
    setRows(
      getRows(
        departments,
        updateDep,
        authData?.admin_status || null,
        deleteDep,
        disableAction
      )
    );
  }, [departments, updateDep, authData, deleteDep, disableAction]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table heads={heads} rows={rows} />
    </div>
  );
};

export default DepartmentTable;
