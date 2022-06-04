import { Card } from "../common";

const cards = [
	{bgColor: "bg-yellow-400", image: "/static/images/users-yellow.png", "title": "TOTAL CLIENTS", txtColor: "text-yellow-400" },
	{bgColor: "bg-green-400", image: "/static/images/users-green.png", "title": "ACTIVE CLIENTS", txtColor: "text-green-400" },
	{bgColor: "bg-red-400", image: "/static/images/users-red.png", "title": "INACTIVE CLIENTS", txtColor: "text-red-400" },
]

type CardsType = { 
	active: number; 
	inactive: number;
	total: number;
}

const Cards = ({ active, total, inactive }: CardsType) => (
	<div className="gap-4 grid grid-col-1 lg:grid-cols-3 my-1 px-2 py-4">
		<Card 
			{...cards[0]}
			value={total}
		/>
		<Card 
			{...cards[1]}
			value={active}
		/>
		<Card 
			{...cards[2]}
			value={inactive}
		/>
	</div>
)

export default Cards;