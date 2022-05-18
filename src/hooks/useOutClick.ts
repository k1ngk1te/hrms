import { useCallback, useEffect, useRef, useState } from "react";

const useOutClick = <Container extends HTMLElement, Button extends HTMLElement>() => {
	const [visible, setVisible] = useState<boolean>(false);
	const ref = useRef<Container>(null);
	const buttonRef = useRef<Button>(null);

	const handleMouseClick = useCallback(({ target }: Event): void => {
		!buttonRef.current?.contains(target as Element) && !ref.current?.contains(target as Element) && setVisible(false);
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleMouseClick, true);

		return () =>
			document.removeEventListener("click", handleMouseClick, true);
	}, [handleMouseClick]);

	return {
		buttonRef,
		ref,
		setVisible,
		visible,
	};
}

export default useOutClick;
