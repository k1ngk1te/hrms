import { useState } from "react";

type NavProps = {
	active: boolean;
	gridLength: number;
	onClick: () => void;
	title: string;
};

const Nav = ({ active, gridLength, onClick, title }: NavProps) => {
	const gl = gridLength
		? gridLength >= 5
			? "lg:w-1/5"
			: gridLength === 4
			? "lg:w-1/4"
			: "lg:w-1/3"
		: "lg:w-1/3";
	const [hovering, setHovering] = useState<boolean>(false);
	const activeStyle = "border-primary-500 text-gray-600";
	const inActiveStyle = "border-transparent text-gray-500";
	const containerStyle = `${gl} cursor-pointer flex justify-center mt-1 w-full md:w-1/2`;

	const navStyle = `
		${active ? activeStyle : hovering ? activeStyle : inActiveStyle}
		border-b-2 capitalize duration-300 inline-block py-1 px-4 rounded-sm 
		text-center text-xs transform transition-colors
		md:text-sm
	`;

	return (
		<div
			onClick={onClick}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className={containerStyle}
		>
			<h6 className={navStyle}>{title}</h6>
		</div>
	);
};

type NavigatorProps = {
	screens: {
		title?: string;
		description?: string;
		component: JSX.Element;
	}[];
};

const TabNavigator = ({ screens }: NavigatorProps) => {
	const [activeScreen, setActiveScreen] = useState<number>(0);
	const title = screens[activeScreen]?.title;
	const description = screens[activeScreen]?.description;

	const gridLength = screens?.length;

	return (
		<div className="bg-gray-100 h-full p-1 pb-0 w-full">
			<div className="border-b border-gray-300 divide-x divide-white flex flex-wrap items-center mb-4">
				{screens?.map(({ title }, index) => (
					<Nav
						active={activeScreen === index}
						key={index}
						gridLength={gridLength}
						onClick={() => setActiveScreen(index)}
						title={title || `${index + 1}`}
					/>
				))}
			</div>
			<div className="bg-white m-2 rounded-lg shadow-lg md:mx-4 md:my-6">
				<div className="bg-gray-200 my-2 rounded-t-lg w-full">
					{title && (
						<h5 className="capitalize font-bold mx-2 py-1 text-sm text-gray-500 tracking-wide md:mx-4 md:text-base">
							{title}
						</h5>
					)}
					{description && (
						<p className="bg-gray-100 p-2 text-gray-500 text-sm md:px-4">
							{description}
						</p>
					)}
				</div>
				<div className="p-2 md:p-4 lg:p-6">
					{screens[activeScreen]?.component}
				</div>
			</div>
		</div>
	);
};

export default TabNavigator;
