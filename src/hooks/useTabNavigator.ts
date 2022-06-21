import { useCallback, useState } from "react";

const useTabNavigator = (noOfScreens: number, screenIndex:number = 0) => {
	const [activeScreen, setActiveScreen] = useState(screenIndex);

	const handleScreenChange = useCallback(
		(screenId: number, direction?: "B" | "F") => {
			if (direction && screenId) {
				setActiveScreen((prevScreen: number) => {
					// In this case screenId will act as the number of screen to move. Usually set as 1
					const goTo =
						direction === "B"
							? prevScreen - screenId
							: prevScreen + screenId;
					if (goTo <= 0) return 0;
					// Less than or equal 0
					// Greater than screen length
					else if (goTo >= noOfScreens) return noOfScreens - 1;
					else return goTo;
				});
			} else {
				if (screenId <= 0) setActiveScreen(0);
				// Less than or equal 0
				else if (screenId >= noOfScreens)
					// Greater than screen length
					setActiveScreen(noOfScreens - 1);
				else setActiveScreen(screenId);
			}
		},
		[noOfScreens]
	);

	return {
		activeScreen,
		onScreenChange: handleScreenChange,
	};
};

export default useTabNavigator;
