import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { HolidayType, HolidayCreateType } from "@/types/employees";
import Table, { HeadType, RowType } from "@/components/controls/Table";

const heads: HeadType = [
  { value: "name" },
  { value: "date"},
  { value: "day"},
  { type: "actions", value: "actions" },
];

const getRows = (
	data: HolidayType[],
	onEdit: (id: number | string, initState: HolidayCreateType) => void,
  	onDelete: (id: number | string, initState: HolidayCreateType) => void
): RowType[] =>
  data.map((holiday) => [
    { value: holiday.name || "---" },
    { value: holiday.date || "---" },
    { value: new Date(holiday.date).toDateString() || "---" },
    {
      type: "actions",
      value: [
        {
          color: "primary",
          Icon: FaPen,
          onClick: () => onEdit(holiday.id, {name: holiday.name, date: holiday.date}),
        },
        {
          color: "danger",
          Icon: FaTrash,
          onClick: () => onDelete(holiday.id, {name: holiday.name, date: holiday.date}),
        },
      ],
    },
  ]);

type TableType = {
  holidays: HolidayType[];
  loading: boolean;
  onEdit: (id: number | string, initState: HolidayCreateType) => void;
  onDelete: (id: number | string, initState: HolidayCreateType) => void;
};

const HolidayTable = ({ holidays, onEdit, onDelete, loading }: TableType) => {
  const [rows, setRows] = useState<RowType[]>([]);

  useEffect(() => {
    setRows(getRows(holidays, onEdit, onDelete));
  }, [holidays, onEdit, onDelete]);

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

export default HolidayTable;
