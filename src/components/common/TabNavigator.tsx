import { useCallback, useEffect, useState } from "react";

export type ScreenType = {
	title?: string;
	description?: string;
	component: JSX.Element;
};

export type NavProps = {
	active: boolean;
	gridLength: number;
	onClick?: () => void;
	title: string;
};

const NavDesign1 = ({
	activeScreen,
	screens,
	setScreen,
	gridLength
}: {
	activeScreen: number;
	screens: ScreenType[];
	setScreen?: (e: number) => void;
	gridLength?: number
}) => (
	<div className="bg-gray-100 border-b border-gray-300 divide-y divide-white flex flex-wrap items-center mb-4 md:divide-y-0 md:divide-x">
		{screens?.map(({ title }, index) => (
			<NavDesignLink1
				active={activeScreen === index}
				key={index}
				gridLength={gridLength || screens.length}
				onClick={setScreen ? () => setScreen(index) : undefined}
				title={title || `${index + 1}`}
			/>
		))}
	</div>
);

const NavDesignLink1 = ({ active, gridLength, onClick, title }: NavProps) => {
	const gl = gridLength
		? gridLength >= 6
			? "lg:w-1/6"
			: gridLength === 5
			? "lg:w-1/5"
			: gridLength === 4
			? "lg:w-1/4"
			: "lg:w-1/3"
		: "lg:w-1/3";
	const [hovering, setHovering] = useState<boolean>(false);
	const activeStyle = "border-primary-500 text-gray-600 border-b-2";
	const inActiveStyle = "border-transparent text-gray-500";
	const containerStyle = `${gl} ${
		onClick ? "cursor-pointer" : ""
	} flex justify-center mt-1 w-full md:w-1/2`;

	const navStyle = `
		${active ? activeStyle : hovering && onClick ? activeStyle : inActiveStyle}
		${
			onClick ? "border-b-2" : ""
		} capitalize duration-300 inline-block py-1 px-4 rounded-sm 
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

export type NavigatorProps = {
	screens: ScreenType[];
	screenIndex?: number;
	container?: string;
	disableNavButtons?: boolean;
	gridLength?: number
};

const TabNavigator = ({
	container,
	screenIndex = 0,
	screens,
	disableNavButtons,
	gridLength,
}: NavigatorProps) => {
	const [activeScreen, setActiveScreen] = useState<number>(screenIndex || 0);
	const title = screens[activeScreen]?.title;
	const description = screens[activeScreen]?.description;

	const screens_length = screens.length;

	const handleScreenChange = useCallback(
		(screenId: number) => {
			if (screenId <= 0) setActiveScreen(0);
			// Less than or equal 0
			else if (screenId >= screens_length)
				// Greater than screen length
				setActiveScreen(screens_length - 1);
			else setActiveScreen(screenId);
		},
		[screens_length]
	);

	useEffect(() => {
		if (typeof screenIndex === "number") handleScreenChange(screenIndex);
	}, [screenIndex, handleScreenChange]);

	return (
		<div className="h-full p-1 pb-0 w-full">
			<NavDesign1
				screens={screens}
				activeScreen={activeScreen}
				setScreen={
					!disableNavButtons
						? (screenId: number) => handleScreenChange(screenId)
						: undefined
				}
				gridLength={gridLength}
			/>
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
				<div className={container}>{screens[activeScreen]?.component}</div>
			</div>
		</div>
	);
};

TabNavigator.defaultProps = {
	screenIndex: 0,
	container: "p-2 md:p-4 lg:p-6",
	disableNavButtons: false,
};

export default TabNavigator;
