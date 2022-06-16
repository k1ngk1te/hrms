import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Card } from "../common";

const cards = [
	{bgColor: "bg-yellow-400", Icon: FaClock, "title": "PENDING LEAVES", txtColor: "text-yellow-400" },
	{bgColor: "bg-green-400", Icon: FaCheckCircle, "title": "APPROVED LEAVES", txtColor: "text-green-400" },
	{bgColor: "bg-red-400", Icon: FaTimesCircle, "title": "DENIED LEAVES", txtColor: "text-red-400" },
]

type CardsType = { 
	pending: number; 
	approved: number; 
	denied: number;
}

const Cards = ({ approved, denied, pending }: CardsType) => (
	<div className="gap-4 grid grid-col-1 lg:grid-cols-3 my-1 px-2 py-4">
		<Card 
			{...cards[0]}
			value={pending}
		/>
		<Card 
			{...cards[1]}
			value={approved}
		/>
		<Card 
			{...cards[2]}
			value={denied}
		/>
	</div>
)

export default Cards;