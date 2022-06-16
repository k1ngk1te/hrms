import { useEffect, useState } from "react";
import { AttendanceType } from "../../types/employees";
import Table, { HeadType, RowType } from "../controls/Table";
import { getTime } from "../../utils";

const heads: HeadType = [
  { value: "date" },
  { value: "punch in"},
  { value: "punch out" },
  { value: "overtime (hours)" },
  { value: "production" },
  { value: "break" },
];

const getRows = (data: AttendanceType[]): RowType[] =>
  data.map((attendance) => [
    { value: attendance.date ? new Date(attendance.date).toDateString() : "---" },
    { value: attendance.punch_in ? getTime(attendance.punch_in) : "---" },
    { value: attendance.punch_out ? getTime(attendance.punch_out) : "---" },
    { value: attendance.overtime || "---" },
    { value: attendance.production || "---" },
    { value: attendance.break || "---" },
  ]);

type TableType = {
  attendance: AttendanceType[];
};

const AttendanceTable = ({ attendance = [] }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);

  useEffect(() => {
    setRows(getRows(attendance));
  }, [attendance]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table
        heads={heads}
        rows={rows}
      />
    </div>
  );
};

export default AttendanceTable;
