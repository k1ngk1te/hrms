import { StatusProgressBar } from "../common";

const Statistics = () => (
	<div className="bg-white px-4 py-2 rounded-lg shadow-lg">
		<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider md:text-xl lg:text-lg">
			statistics
		</h3>
		<div>
		<div className="my-3">
			<StatusProgressBar background="bg-red-600" title="Today" result={3.48 / 8} value={`${(3.48 / 8) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-yellow-600" title="This Week" result={28 / 40} value={`${(28 / 40) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-green-600" title="This Month" result={52 / 160} value={`${(52 / 160) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-purple-600" title="Remaining" result={52 / 160} value={`${(108 / 160) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-blue-600" title="Today" result={28 / 160} value={`${(28 / 160) * 100}%`} />
		</div>
			<div className="my-3">
		</div>
	</div>
	</div>
);

export default Statistics