import { useEffect, useState } from "react";
import { useFadeIn } from "@/hooks";

export const Statistic = ({
	background,
	end,
	start,
	title,
}: {
	background: string;
	title: string;
	start: number;
	end: number;
}) => {
	const [width, setWidth] = useState(0);
	const { ref, visible } = useFadeIn<HTMLDivElement>(true);

	useEffect(() => {
		if (visible) setWidth((start / end) * 100);
	}, [visible]);

	return (
		<div className="bg-gray-100 border border-gray-300 my-3 px-3 py-2 rounded-lg">
			<div className="flex items-center justify-between my-1 w-full">
				<span className="capitalize font-semibold inline-block text-gray-900 text-sm">
					{title}
				</span>
				<span className="font-semibold inline-block text-gray-900 text-sm">
					{start} / {end} hrs
				</span>
			</div>
			<div className="bg-gray-400 h-1 my-1 rounded-lg w-full">
				<div
					ref={ref}
					className={`${background} duration-1000 h-full transform transition-all`}
					style={{ width: `${width}%` }}
				/>
			</div>
		</div>
	);
};

const Statistics = () => (
	<div className="bg-white px-4 py-2 rounded-lg shadow-lg">
		<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider md:text-xl lg:text-lg">
			statistics
		</h3>
		<div>
			<Statistic background="bg-red-600" start={3.48} end={8} title="today" />
			<Statistic
				background="bg-yellow-600"
				start={28}
				end={40}
				title="this week"
			/>
			<Statistic
				background="bg-green-600"
				start={108}
				end={160}
				title="this month"
			/>
			<Statistic
				background="bg-purple-600"
				start={52}
				end={160}
				title="remaining"
			/>
			<Statistic
				background="bg-blue-600"
				start={28}
				end={160}
				title="overtime"
			/>
		</div>
	</div>
);

export default Statistics