import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const months: MonthType[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

type MonthType =
	| "January"
	| "February"
	| "March"
	| "April"
	| "May"
	| "June"
	| "July"
	| "August"
	| "September"
	| "October"
	| "November"
	| "December";

const Body = ({
	changeFn,
	list,
	title,
}: {
	title: string;
	changeFn: (index: number) => void;
	list: { key: string | number; value: number }[];
}) => (
	<div className="flex flex-col justify-start p-2">
		<p className="card-heading">{title}</p>
		<div className="bg-gray-100 gap-2 grid grid-cols-4 p-2">
			{list.map((item, index) => (
				<div
					className="bg-white cursor-pointer flex items-center justify-center py-2 text-gray-700 hover:bg-gray-300 hover:text-white"
					onClick={() => changeFn(item.value)}
					key={index}
				>
					<span className="font-medium text-center text-base tracking-wider md:text-lg">
						{item.key}
					</span>
				</div>
			))}
		</div>
	</div>
);

const Months = ({ changeMonth }: { changeMonth: (index: number) => void }) => {
	const list = months.map((month, index) => ({
		value: index,
		key: month.slice(0, 3),
	}));
	return <Body changeFn={changeMonth} list={list} title="select month" />;
};

const Years = ({ changeYear }: { changeYear: (index: number) => void }) => {
	const currentYear = new Date().getFullYear() + 10;
	const firstYear = new Date(0).getFullYear();
	let list = [];
	for (let i = firstYear; i <= currentYear; i++) {
		list.push({ key: i, value: i });
	}
	return (
		<Body changeFn={changeYear} list={list.reverse()} title="select year" />
	);
};

const arrowClasses =
	"flex justify-center h-full py-2 text-center text-xs w-[10%] md:text-sm";

const Topbar = ({
	disabled,
	onTitleClick,
	onLeftClick,
	onRightClick,
	title,
}: {
	disabled: {
		left: boolean;
		right: boolean;
	};
	title: string | number;
	onLeftClick: () => void;
	onTitleClick: () => void;
	onRightClick: () => void;
}) => (
	<div className="bg-white flex items-center w-full">
		<div
			onClick={onLeftClick}
			className={`${
				disabled.left
					? "bg-gray-500 cursor-not-allowed invisible text-gray-50"
					: "cursor-pointer text-primary-500 hover:bg-gray-100"
			} ${arrowClasses}`}
		>
			<span>
				<FaChevronLeft />
			</span>
		</div>
		<div
			onClick={onTitleClick}
			className="cursor-pointer flex justify-center h-full py-2 text-center w-[80%] hover:bg-gray-50"
		>
			<span className="cursor-pointer font-semibold text-gray-700 text-sm tracking-wider md:text-base">
				{title}
			</span>
		</div>
		<div
			onClick={onRightClick}
			className={`${
				disabled.right
					? "bg-gray-500 cursor-not-allowed invisible text-gray-50"
					: "cursor-pointer text-primary-500 hover:bg-gray-100"
			} ${arrowClasses}`}
		>
			<span>
				<FaChevronRight />
			</span>
		</div>
	</div>
);

const Days = ({
	changeYear,
	changeMonth,
	changeDate,
	changeScreen,
	selectedDate,
	selectedMonth,
	selectedYear,
	days,
	month,
	year,
}: {
	changeYear: (e: number) => void;
	changeMonth: (e: number) => void;
	changeDate: (e: number) => void;
	changeScreen: (e: "months" | "years") => void;
	selectedDate: number;
	selectedMonth: number;
	selectedYear: number;
	days: number;
	month: number;
	year: number;
}) => {
	const firstYear = new Date(0).getFullYear();
	const currentYear = new Date().getFullYear() + 10;

	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth();
	const todayYear = today.getFullYear();

	return (
		<div className="divide-y divide-gray-300 divide-opacity-50 w-full">
			<Topbar
				disabled={{
					left: firstYear === year,
					right: currentYear === year,
				}}
				onTitleClick={() => changeScreen("years")}
				onLeftClick={() => year > firstYear && changeYear(year - 1)}
				onRightClick={() => year < currentYear && changeYear(year + 1)}
				title={year}
			/>
			<Topbar
				disabled={{
					left: month === 0,
					right: month === 11,
				}}
				onTitleClick={() => changeScreen("months")}
				onLeftClick={() => month > 0 && changeMonth(month - 1)}
				onRightClick={() => month < 11 && changeMonth(month + 1)}
				title={months[month]}
			/>
			<div className="gap-1 grid grid-cols-6 min-h-[16rem] px-1 pt-3 pb-1">
				{Array.from(Array(days).keys()).map((_day) => {
					const day = _day + 1;

					const active =
						day === todayDate && month === todayMonth && year === todayYear
							? true
							: false;
					const selected =
						day === selectedDate &&
						month === selectedMonth &&
						year === selectedYear
							? true
							: false;

					return (
						<div key={day} className="flex items-center justify-center p-1">
							<span
								onClick={() => changeDate(day)}
								className={`${
									selected
										? "bg-blue-700 text-gray-50 hover:bg-blue-600"
										: active
										? "bg-green-700 text-gray-50 hover:bg-green-600"
										: "bg-white text-gray-600 hover:bg-gray-50"
								} border-blue-700 cursor-pointer duration-300 font-medium inline-block px-2 py-[0.3125rem] rounded-full shadow-lg text-sm hover:border hover:scale-110 md:text-base`}
							>
								{`${day > 9 ? "" : "0"}${day}`}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Calendar = () => {
	const date = new Date();
	const dateDate = date.getDate();
	const dateMonth = date.getMonth();
	const dateYear = date.getFullYear();

	const [screen, setScreen] = useState<"days" | "months" | "years">("days");

	const [days, setDays] = useState(31);
	const [month, setMonth] = useState(dateMonth);
	const [year, setYear] = useState(dateYear);

	const [day, setDay] = useState(dateDate);
	const [_month, _setMonth] = useState(dateMonth);
	const [_year, _setYear] = useState(dateYear);

	useEffect(() => {
		const mthStrDate = new Date(year, month, 1);
		const nextMonth = month > 11 ? 0 : month + 1;
		const nextYear = month > 11 ? year + 1 : year;
		const mthEndDate = new Date(nextYear, nextMonth, 1);
		const noOfDays =
			(mthEndDate.getTime() - mthStrDate.getTime()) / (1000 * 60 * 60 * 24);
		setDays(noOfDays);
	}, [month, year]);

	return (
		<div className="bg-gray-50 h-full min-h-[18rem] max-h-[24.5rem] overflow-y-auto p-2 rounded-lg w-full md:max-h-[26rem]">
			<div className="bg-white p-2">
				<p className="font-medium text-center text-gray-600 text-base tracking-widest md:text-lg">
					{new Date(_year, _month, day).toLocaleDateString("en-CA")}
				</p>
			</div>
			{screen === "years" ? (
				<Years
					changeYear={(index) => {
						setScreen("days");
						setYear(index);
					}}
				/>
			) : screen === "months" ? (
				<Months
					changeMonth={(index) => {
						setScreen("days");
						setMonth(index);
					}}
				/>
			) : (
				<Days
					changeScreen={(src) => setScreen(src)}
					selectedDate={day}
					selectedMonth={_month}
					selectedYear={_year}
					days={days}
					month={month}
					year={year}
					changeDate={(e: number) => {
						setDay(e);
						_setMonth(month);
						_setYear(year);
					}}
					changeMonth={(e: number) => setMonth(e)}
					changeYear={(e: number) => setYear(e)}
				/>
			)}
		</div>
	);
};

export default Calendar;
