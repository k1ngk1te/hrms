import { Card } from "../common";

const cards = [
	{bgColor: "bg-green-400", image: "/static/images/users-green.png", "title": "ACTIVE EMPLOYEES", txtColor: "text-green-400" },
	{bgColor: "bg-yellow-400", image: "/static/images/users-yellow.png", "title": "EMPLOYEES ON LEAVE", txtColor: "text-yellow-400" },
	{bgColor: "bg-red-400", image: "/static/images/users-red.png", "title": "INACTIVE EMPLOYEES", txtColor: "text-red-400" },
]

type CardsType = { 
	active: number; 
	leave: number; 
	inactive: number;
}

const Cards = ({ active, leave, inactive }: CardsType) => (
	<div className="gap-4 grid grid-col-1 lg:grid-cols-3 my-1 px-2 py-4">
		<Card 
			{...cards[0]}
			value={active}
		/>
		<Card 
			{...cards[1]}
			value={leave}
		/>
		<Card 
			{...cards[2]}
			value={inactive}
		/>
	</div>
)

export default Cards;