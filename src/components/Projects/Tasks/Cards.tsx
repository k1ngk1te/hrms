import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Card } from "../../common";

const cards = [
	{bgColor: "bg-gray-400", Icon: FaClock, "title": "TOTAL TASKS", txtColor: "text-gray-400" },
	{bgColor: "bg-green-400", Icon: FaCheckCircle, "title": "COMPLETED TASKS", txtColor: "text-green-400" },
	{bgColor: "bg-yellow-400", Icon: FaTimesCircle, "title": "PENDING TASKS", txtColor: "text-yellow-400" },
]

type CardsType = { 
	pending: number; 
	completed: number; 
	total: number;
}

const Cards = ({ completed, total, pending }: CardsType) => (
	<div className="gap-4 grid grid-col-1 lg:grid-cols-3 my-1 px-2 py-4">
		<Card 
			{...cards[0]}
			value={total}
		/>
		<Card 
			{...cards[1]}
			value={completed}
		/>
		<Card 
			{...cards[2]}
			value={pending}
		/>
	</div>
)

export default Cards;