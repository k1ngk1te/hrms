import { useEffect, useState } from "react";
import { AttendanceType } from "@/types/employees";
import Table, { HeadType, RowType } from "@/components/controls/Table";

const heads: HeadType = [
  { value: "date" },
  { value: "punch in"},
  { value: "punch out" },
  { value: "production" },
  { value: "break" },
  { value: "overtime" }
];

const getRows = (data: AttendanceType[]): RowType[] =>
  data.map((attendance) => [
    { value: attendance.date ? new Date(attendance.date).toDateString() : "---" },
    { value: attendance.punch_in || "---" },
    { value: attendance.punch_out || "---" },
    { value: attendance.production || "---" },
    { value: attendance.break || "---" },
    { value: attendance.overtime || "---" }
  ]);

type TableType = {
  attendance: AttendanceType[];
  loading: boolean;
};

const ClientTable = ({ attendance = [], loading }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);

  useEffect(() => {
    setRows(getRows(attendance));
  }, [attendance]);

  return (
    <div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
      <Table
        loading={loading}
        heads={heads}
        rows={rows}
      />
    </div>
  );
};

export default ClientTable;
