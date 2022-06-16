import { useCallback, useEffect, useRef } from "react";
import { IconType } from "react-icons";
import { FaTimesCircle } from "react-icons/fa"
import DecisionButton, { ButtonProps as DecisionButtonTypes } from "./Button";

const containerStyle = "duration-1000 max-w-xs mx-auto px-4 rounded-lg transform transition-all w-full sm:px-0";
const wrapperStyle = "duration-500 fixed flex h-full items-center left-0 top-0 transform transition-opacity w-full z-[200]"

export type ModalProps = {
	close: () => void
	color?: "danger" | "info" | "pacify" | "primary" | "secondary" | "success" | "warning"
	decisions?: DecisionButtonTypes[]
	header?: string
	footer?: string
	Icon?: IconType
	keepVisible?: boolean
	message: string
	visible: boolean
}

const AlertModal = ({ close, color, decisions, header, Icon, footer, keepVisible, message, visible }: ModalProps) => {
	const bgColor =
		color === "danger"
			? "bg-red-500"
			: color === "info"
			? "bg-gray-500"
			: color === "pacify"
			? "bg-blue-500"
			: color === "primary"
			? "bg-primary-500"
			: color === "secondary"
			? "bg-secondary-500"
			: color === "success"
			? "bg-green-500"
			: color === "warning"
			? "bg-yellow-500"
			: "bg-gray-500";

	const cancelStyle = 
		color === "danger"
			? "hover:text-red-600"
			: color === "info"
			? "hover:text-gray-600"
			: color === "pacify"
			? "hover:text-blue-600"
			: color === "primary"
			? "hover:text-primary-600"
			: color === "secondary"
			? "hover:text-secondary-600"
			: color === "success"
			? "hover:text-green-600"
			: color === "warning"
			? "hover:text-yellow-600"
			: "hover:text-gray-600"

	const iconColor =
		color === "danger"
			? "border-red-500 text-red-500 hover:text-red-600"
			: color === "info"
			? "border-gray-500 text-gray-500 hover:text-gray-600"
			: color === "pacify"
			? "border-blue-500 text-blue-500 hover:text-blue-600"
			: color === "primary"
			? "border-primary-500 text-primary-500 hover:text-primary-600"
			: color === "secondary"
			? "border-secondary-500 text-secondary-500 hover:text-secondary-600"
			: color === "success"
			? "border-green-500 text-green-500 hover:text-green-600"
			: color === "warning"
			? "border-yellow-500 text-yellow-500 hover:text-yellow-600"
			: "border-gray-500 text-gray-500 hover:text-gray-600"

	const ref = useRef<HTMLDivElement>(null);

	const handleMouseClick = useCallback(
		({ target }: Event) =>
			!keepVisible &&
			typeof close === "function" &&
			!ref?.current?.contains(target as Element) &&
			close(),
		[close, keepVisible]
	);

	useEffect(() => {
		if (keepVisible === false)
			document.addEventListener("click", handleMouseClick, true);
		else document.removeEventListener("click", handleMouseClick, true);

		return () =>
			document.removeEventListener("click", handleMouseClick, true);
	}, [keepVisible, handleMouseClick]);

	return (
		<div 
			className={`${wrapperStyle}
				${visible ? "opacity-100 scale-100 visible" : "invisible opacity-0 scale-0"}
			`}
			style={{ background: "rgba(0, 0, 0, 0.6)" }}
		>
			<div 
				ref={ref}
				className={`${containerStyle}
					${visible ? "scale-100" : "scale-0" }
				`}
			>
				
				<div className={`${bgColor} flex items-center justify-between px-4 py-2 rounded-t-lg`}>
					<h6 className={`${bgColor ? "text-white" : "text-gray-500"} text-xs md:text-sm`}>
						{header && header}
					</h6>
					<span 
						onClick={close}
						className={`${cancelStyle} block cursor-pointer duration-500 m-1 rounded-full text-xs text-white hover:bg-gray-200`}
					>
						<FaTimesCircle className={"text-sm m-2 " + cancelStyle} />
					</span>
				</div>

				<div className={`bg-white flex flex-col items-center px-5 py-4 ${footer ? "" : "rounded-b-lg"}`}>
					{Icon && (
						<span className={iconColor + " border flex items-center justify-center rounded-round mt-2 p-4 text-xs"}>
							<Icon className={iconColor + " text-lg sm:text-xl md:text-2xl lg:text-3xl"} />
						</span>
					)}
					<p className="mt-3 text-center text-gray-500 text-xs md:text-sm">
						{message}
					</p>
					{decisions && (
						<div className="flex flex-wrap mt-3 items-center justify-around w-full" style={{maxWidth: "12rem"}}>
							{decisions.map((decision, index) => (
								<div key={index} onClick={close}>
									<DecisionButton {...decision} />
								</div>
							))}
						</div>
					)}
				</div>

				{footer && (
					<div className={`${bgColor} px-4 py-2 rounded-b-lg`}>
						<h6 className={`${bgColor ? "text-white" : "text-gray-500"} text-xs md:text-sm`}>
							{footer}
						</h6>
					</div>
				)}
			</div>
		</div>
	)
}

AlertModal.defaultProps = {
	keepVisible: false
}

export default AlertModal;