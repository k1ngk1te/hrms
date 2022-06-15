import { CSSProperties } from "react"
const containerStyle = "flex justify-center items-center rounded-full";

export type DotsLoaderType = {
	color?: "danger" | "info" | "pacify" | "primary" | "secondary" | "success" | "transparent" | "warning" | "white";
	delay?: number[];
	margin?: number;
	noOfDots?: number;
	size?: number;
	transitionType?: "ease-in" | "ease-out" | "ease-in-out";
}

export const DotsLoader = ({
	color,
	delay,
	margin,
	noOfDots,
	size,
	transitionType
}: DotsLoaderType) => {
	const colour =
		color === "danger"
			? "bg-red-600"
			: color === "info"
			? "bg-gray-600"
			: color === "pacify"
			? "bg-blue-600"
			: color === "primary"
			? "bg-primary-500"
			: color === "secondary"
			? "bg-secondary-500"
			: color === "success"
			? "bg-green-600"
			: color === "warning"
			? "bg-yellow-600"
			: color === "white"
			? "bg-white"
			: color === "transparent" && "bg-transparent";
	const _margin = `${(margin || 1) * 0.0625}rem`
	const _size = `${(size || 4) * 0.25}rem`
	const dotStyle = `animate-bounce ${colour} duration-1000 ${transitionType} rounded-full`
	const _style = {margin: _margin, height: _size, width: _size}
	const _Array: number[] = (noOfDots && delay && noOfDots === delay.length) 
		? Array.from(Array(noOfDots).keys()) : Array.from(Array(3).keys())

	return (
		<div className="flex justify-center items-center">
			{_Array.map((arr, index) => (
				<div
					key={index} 
					className={dotStyle} 
					style={{ 
						..._style, 
						animationDelay: `${delay ? delay[index] : 0}s`
					}} 
				/>
			))}
		</div>
	)
}

DotsLoader.defaultProps = {
	color: "primary",
	delay: [0, 0.2, 0.45],
	margin: 4,
	noOfDots: 3,
	size: 4,
	transitionType: "ease-in-out"
}

const Loader = ({
	animate,
	background,
	border,
	className,
	color,
	rounded,
	size,
	type,
	width,
	style,
	...props
}: LoaderProps) => {
	const _animation =
		animate === "bounce"
			? "animate-bounce"
			: animate === "pulse"
			? "animate-pulse"
			: animate === "spin" && "animate-spin";

	const bg =
		background === "danger"
			? "bg-red-600"
			: background === "info"
			? "bg-gray-600"
			: background === "pacify"
			? "bg-blue-600"
			: background === "primary"
			? "bg-primary-500"
			: background === "secondary"
			? "bg-secondary-500"
			: background === "success"
			? "bg-green-600"
			: background === "warning"
			? "bg-yellow-600"
			: background === "white"
			? "bg-white"
			: background === "transparent" && "bg-transparent";

	const colour =
		color === "danger"
			? "border-red-600"
			: color === "info"
			? "border-gray-600"
			: color === "pacify"
			? "border-blue-600"
			: color === "primary"
			? "border-primary-500"
			: color === "secondary"
			? "border-secondary-500"
			: color === "success"
			? "border-green-600"
			: color === "warning"
			? "border-yellow-600"
			: color === "white" && "border-white"

	const _type =
		type === "dashed"
			? "border-dashed"
			: type === "dotted"
			? "border-dotted"
			: type === "double"
			? "border-double"
			: type === "solid" && "border-solid";

	const _width =
		width === "xs"
			? "border"
			: width === "sm"
			? "border-2"
			: width === "md"
			? "border-4"
			: width === "lg" && "border-8"

	const styleLoader = {
		height: `${size ? size * 0.25 : 2}rem`,
		width: `${size ? size* 0.25 : 2}rem`,
		...style,
	};

	return (
		<div className={containerStyle + " " + (className || "")}>
			<div
				className={`${border} ${rounded} ${_animation} ${bg} ${colour} ${_type} ${_width} rounded-full`}
				style={styleLoader}
				{...props}
			/>
		</div>
	);
};

Loader.defaultProps = {
	animate: "spin",
	background: "transparent",
	border: "border-t-0 border-b-0",
	color: "white",
	rounded: "rounded-full",
	size: 8,
	type: "solid",
	width: "sm"
}

export type LoaderProps = {
	animate?: "bounce" | "pulse" | "spin";
	background?: "danger" | "info" | "pacify" | "primary" | "secondary" | "success" | "transparent" | "warning" | "white";
	border?: string;
	className?: string;
	color?: "danger" | "info" | "pacify" | "primary" | "secondary" | "success" | "warning" | "white";
	rounded?: string;
	size?: number;
	type?: "dashed" | "dotted" | "double" | "solid";
	width?: "xs" | "sm" | "md" | "lg";
	style?: CSSProperties;
}

export default Loader;