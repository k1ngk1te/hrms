import { CSSProperties, ReactNode } from "react";
import { useFadeIn } from "../../hooks";

type FadeInProps = {
	children: ReactNode;
	className?: string;
	duration?: "300" | "500" | "700" | "1000";
	from?: "center" | "top";
	persist?: boolean;
	style?: CSSProperties;
}

const FadeIn = ({ children, className, duration, from, persist, style }: FadeInProps) => {
	const { ref, visible } = useFadeIn<HTMLDivElement>(persist || true);

	const _duration = duration === "300" ? "duration-300" : duration === "1000" ? "duration-1000" : duration === "700" ? "duration-700" : duration === "500" ? "duration-500" : "duration-500";

	const istyle = `${_duration} transform transition`;

	const hide = from === "center" ? "scale-0" : "translate-y-32";
	const show = from === "top" ? "scale-100" : "translate-y-0";

	return (
		<div
			ref={ref}
			className={`${istyle} ${
				visible
					? `${show} opacity-100 visible`
					: `${hide} invisible opacity-0`
			} ${className}`}
			style={style}
		>
			{children}
		</div>
	);
};

FadeIn.defaultProps = {
	duration: "1000",
	from: "top",
	persist: true,
}

export default FadeIn;
