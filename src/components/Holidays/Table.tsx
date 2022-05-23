import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useAppSelector } from "@/hooks";
import { HolidayType, HolidayCreateType } from "@/types/employees";
import Table, { HeadType, RowType } from "@/components/controls/Table";

const heads: HeadType = [
	{ value: "name" },
	{ value: "date" },
	{ value: "day" },
];

const getRows = (
	data: HolidayType[],
	onEdit: (id: number | string, initState: HolidayCreateType) => void,
	onDelete: (id: number | string, initState: HolidayCreateType) => void,
	isAdmin: boolean
): RowType[] =>
	data.map((holiday) => {
		let row: RowType[] = [
			{ value: holiday.name || "---" },
			{ value: holiday.date || "---" },
			{ value: new Date(holiday.date).toDateString() || "---" },
		];

		if (isAdmin)
			row = [
				...row,
				{
					type: "actions",
					value: [
						{
							color: "primary",
							Icon: FaPen,
							onClick: () =>
								onEdit(holiday.id, { name: holiday.name, date: holiday.date }),
						},
						{
							color: "danger",
							Icon: FaTrash,
							onClick: () =>
								onDelete(holiday.id, {
									name: holiday.name,
									date: holiday.date,
								}),
						},
					],
				},
			];
		return row;
	});

type TableType = {
	holidays: HolidayType[];
	loading: boolean;
	onEdit: (id: number | string, initState: HolidayCreateType) => void;
	onDelete: (id: number | string, initState: HolidayCreateType) => void;
};

const HolidayTable = ({ holidays, onEdit, onDelete, loading }: TableType) => {
	const [rows, setRows] = useState<RowType[]>([]);

	const authData = useAppSelector((state) => state.auth.data);
	const isAdmin =
		authData?.admin_status === "hr" || authData?.admin_status === "md";

	const _heads = isAdmin
		? [...heads, { type: "actions", value: "actions" }]
		: heads;

	useEffect(() => {
		setRows(getRows(holidays, onEdit, onDelete, isAdmin));
	}, [holidays, onEdit, onDelete, isAdmin]);

	return (
		<div className="mt-4 rounded-lg p-2 md:p-3 lg:p-4">
			<Table loading={loading} heads={_heads} rows={rows} />
		</div>
	);
};

export default HolidayTable;
