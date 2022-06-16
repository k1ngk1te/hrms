import { useCallback, useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa"

const wrapperStyle =
	"duration-500 fixed flex h-full items-center justify-center left-0 overflow-hidden px-3 top-0 transform transition-opacity w-full z-40";
const containerStyle =
	"bg-white border border-dashed border-primary-500 duration-1000 max-w-2xl mx-auto overflow-y-auto p-3 relative rounded-lg shadow-lg transform transition-all w-full z-50";
const hideContainer = "-translate-y-full opacity-0 invisible ";
const showContainer = "translate-y-0 opacity-100 visible ";

type ModalProps = {
	component: JSX.Element
	close: () => void
	description?: string
	keepVisible?: boolean
	visible: boolean
	title?: string
}

const Modal = ({
	component,
	close,
	description,
	keepVisible,
	visible,
	title,
}: ModalProps) => {
	const [reset, setReset] = useState<boolean>(false);

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
		if (visible) setReset(false);
	}, [visible]);

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
				className={
					(visible ? showContainer : hideContainer) + containerStyle
				}
				ref={ref}
				style={{ maxHeight: "90vh" }}
			>
				{reset === false && (<>
					<header className="flex items-start justify-between w-full">
						<div className="mx-4">
							{title && (
								<>
									<h4 className="capitalize font-semibold mb-2 text-primary-500 text-sm md:text-base">
										{title}
									</h4>
									{description && (
										<p className="mt-1 text-gray-400 text-xs md:text-sm">
											{description}
										</p>
									)}
								</>
							)}
						</div>
						<div
							onClick={() => {
								close();
								setReset(true);
							}}
							className="cursor-pointer duration-500 mx-4 p-2 rounded-full text-gray-700 text-xs transform transition-all hover:bg-gray-200 hover:scale-110 hover:text-gray-600 md:text-sm"
						>
							<FaTimes className="text-xs sm:text-sm" />
						</div>
					</header>
					<main>{component}</main>
				</>)}
			</div>
		</div>
	);
};

Modal.defaultProps = {
	keepVisible: false,
};

export default Modal;
