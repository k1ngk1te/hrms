import { Button } from "@/components/controls";

const TimeSheet = () => (
	<div className="bg-white px-4 py-2 rounded-lg shadow-lg">
		<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider sm:text-center md:text-left md:text-xl">
			timesheet
		</h3>
		<div className="bg-gray-100 border border-gray-300 max-w-xs mx-auto my-1 px-3 py-2 rounded-lg">
			<span className="font-semibold my-3 inline-block text-gray-900 text-sm lg:my-1">
				Punch In at
			</span>
			<p className="capitalize text-gray-500 tracking-wide text-lg md:text-base">
				mon may 09 2022 11:00AM
			</p>
		</div>
		<div className="flex justify-center items-center my-4 lg:my-3">
			<div className="border-4 border-gray-200 px-5 py-10 rounded-full">
				<span className="font-semibold text-gray-800 text-2xl md:text-3xl lg:text-2xl">
					3.45 hrs
				</span>
			</div>
		</div>
		<div className="flex justify-center items-center my-1">
			<div>
				<Button
					caps
					padding="px-4 py-2 md:px-6 md:py-3 lg:px-4 lg:py-2"
					rounded="rounded-xl"
					title="Punch Out"
					titleSize="text-base sm:tracking-wider md:text-lg"
				/>
			</div>
		</div>
		<div className="grid grid-cols-2 gap-4 my-3 pt-2 lg:my-1">
			<div className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-center w-full">
				<span className="font-semibold my-1 inline-block text-gray-900 text-sm">
					Break
				</span>
				<p className="capitalize text-gray-500 tracking-wide text-base">
					1.21 hrs
				</p>
			</div>
			<div className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-center w-full">
				<span className="font-semibold my-1 inline-block text-gray-900 text-sm">
					Overtime
				</span>
				<p className="capitalize text-gray-500 tracking-wide text-base">
					3 hrs
				</p>
			</div>
		</div>
	</div>
);

export default TimeSheet;