export const TimeCard = ({
	border,
	color,
	day,
	time,
}: {
	color: string;
	day: string;
	border: string;
	time?: string;
}) => (
	<div className="flex items-start">
		<div className="flex flex-col items-center h-full">
			<div
				className={`${border} border-2 h-[0.75rem] m-1 rounded-full w-[0.6rem]`}
			/>
			<div className="bg-gray-400 h-full min-h-[22px] rounded-lg w-[1.5px]" />
		</div>
		<div className="flex flex-col mx-2 w-full md:flex-row md:justify-between">
			<div>
				<span className="block capitalize font-medium mb-1 text-gray-700 text-xs md:text-sm">
					{day}
				</span>
				<span className="capitalize font-semibold text-gray-500 text-xs">
					{time || "-------"}
				</span>
			</div>
		</div>
	</div>
);

const Activity = () => {
	const week = [
		{
			day: "monday",
			pit: "8:00AM",
			pot: "5:00PM",
			pic: "bg-green-600",
			bic: "border-green-600",
			poc: "bg-green-600",
			boc: "border-green-600",
		},
		{
			day: "tuesday",
			pit: "8:00AM",
			pot: "5:00PM",
			pic: "bg-gray-600",
			bic: "border-gray-600",
			poc: "bg-gray-600",
			boc: "border-gray-600",
		},
		{
			day: "wednesday",
			// pit: "8:00AM",
			// pot: "5:00PM",
			pic: "bg-green-600",
			bic: "border-green-600",
			poc: "bg-yellow-600",
			boc: "border-yellow-600",
		},
		{
			day: "thursday",
			// pit: "8:00AM",
			// pot: "5:00PM",
			pic: "bg-red-600",
			bic: "border-red-600",
			poc: "bg-red-600",
			boc: "border-red-600",
		},
		{
			day: "friday",
			// pit: "8:00AM",
			// pot: "5:00PM",
			pic: "bg-gray-400",
			bic: "border-gray-400",
			poc: "bg-gray-400",
			boc: "border-gray-400",
		},
	];
	return (
		<div className="bg-white px-4 py-2 rounded-lg shadow-lg md:col-span-2 lg:col-span-1">
			<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider md:text-xl lg:text-lg">
				Weekly Activity
			</h3>
			<div className="flex items-center">
				<div className="px-1 w-1/2">
					<span className="capitalize font-semibold inline-block text-center text-gray-700 text-base">
						punch in
					</span>
				</div>
				<div className="px-2 w-1/2">
					<span className="capitalize font-semibold inline-block text-center text-gray-700 text-base">
						punch out
					</span>
				</div>
			</div>
			{week.map(({ day, pit, bic, boc, pot, pic, poc }) => (
				<div key={day} className="gap-4 grid grid-cols-2 my-2">
					<TimeCard color={pic} border={bic} day={day} time={pit} />
					<TimeCard color={poc} day={day} border={boc} time={pot} />
				</div>
			))}
		</div>
	);
};


export default Activity