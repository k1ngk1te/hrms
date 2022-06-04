import { FaCheckCircle, FaClock, FaBook } from "react-icons/fa";
import { Card } from "../common";

const cards = [
	{bgColor: "bg-gray-400", Icon: FaBook, "title": "TOTAL PROJECTS", txtColor: "text-gray-400" },
	{bgColor: "bg-yellow-400", Icon: FaClock, "title": "ONGOING PROJECTS", txtColor: "text-yellow-400" },
	{bgColor: "bg-green-400", Icon: FaCheckCircle, "title": "COMPLETED PROJECTS", txtColor: "text-green-400" },
]

type CardsType = { 
	completed: number;
	ongoing: number;
	total: number;
}

const Cards = ({ completed, total, ongoing }: CardsType) => (
	<div className="gap-4 grid grid-col-1 lg:grid-cols-3 my-1 px-2 py-4">
		<Card 
			{...cards[0]}
			value={total}
		/>
		<Card 
			{...cards[1]}
			value={ongoing}
		/>
		<Card 
			{...cards[2]}
			value={completed}
		/>
	</div>
)

export default Cards;