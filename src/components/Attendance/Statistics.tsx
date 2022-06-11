import { StatusProgressBar } from "../common";
import { AttendanceStatisticsType } from "../../types";


const Statistics = ({ today, week }: AttendanceStatisticsType) => (
	<div className="bg-white px-4 py-2 rounded-lg shadow-lg">
		<h3 className="capitalize font-black my-2 text-gray-700 text-lg tracking-wider md:text-xl lg:text-lg">
			statistics
		</h3>
		<div>
		<div className="my-3">
			<StatusProgressBar 
				background="bg-red-600" 
				title="Today" 
				result={today || 0} 
				value={`${today ? Math.floor(today * 100) : 0}%`} 
			/>
		</div>
			<div className="my-3">
			<StatusProgressBar 
				background="bg-yellow-600" 
				title="This Week" 
				result={week || 0} 
				value={`${week ? Math.floor(week * 100) : 0}%`} 
			/>
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-green-600" title="This Month" result={52 / 160} value={`${(52 / 160) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-purple-600" title="Remaining" result={52 / 160} value={`${(108 / 160) * 100}%`} />
		</div>
			<div className="my-3">
			<StatusProgressBar background="bg-blue-600" title="Overtime" result={28 / 160} value={`${(28 / 160) * 100}%`} />
		</div>
			<div className="my-3">
		</div>
	</div>
	</div>
);

export default Statistics