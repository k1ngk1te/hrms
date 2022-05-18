import { useEffect, useRef, useState } from "react";

const useFadeIn = <Container extends HTMLElement>(persist = false, options?: object) => {
	const ref = useRef<Container>(null);
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (persist) {
					if (entry.isIntersecting) setVisible(true);
				} else {
					setVisible(entry.isIntersecting);
				}
			})
		}, options)

		if (ref.current) observer.observe(ref.current)

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		}
	})

	return {
		ref,
		visible,
	};
};

export default useFadeIn;
