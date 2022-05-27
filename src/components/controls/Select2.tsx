import { FC } from "react";
import { IconType } from "react-icons";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import Badge, { BadgeProps } from "../common/Badge";
import Button, { ButtonProps } from "./Button";
import { useOutClick } from "../../hooks";

export type SelectProps = {
	bg?: string;
	badge?: BadgeProps;
	bdr?: string;
	bdrColor?: string;
	btn?: ButtonProps;
	closeOnClick?: boolean;
	color?: string;
	disabled?: boolean;
	divide?: string;
	divideColor?: string;
	error?: string;
	errorSize?: string;
	focus?: string;
	focusColor?: string;
	Icon?: IconType;
	iconColor?: string;
	iconSize?: string;
	label?: string;
	labelColor?: string;
	labelSize?: string;
	imageSize?: string;
	multiple?: boolean;
	name?: string;
	onSelect: (e: { title: string; value: string | number }) => void;
	optionBgActive?: string;
	optionBgHover?: string;
	optionTextActive?: string;
	optionTextColor?: string;
	optionTextHover?: string;
	options: {
		Icon?: IconType;
		image?: string;
		title: string;
		value: string | number;
	}[];
	padding?: string;
	placeholder?: string;
	placeholderImage?: string;
	rounded?: string;
	textSize?: string;
	value: string | number | string[] | number[];
};

const Select: FC<SelectProps> = ({
	badge,
	bdr,
	bdrColor,
	bg,
	btn,
	color,
	closeOnClick,
	disabled,
	divide,
	divideColor,
	error,
	errorSize,
	focus,
	focusColor,
	Icon,
	iconColor,
	iconSize,
	imageSize,
	label,
	labelColor,
	labelSize,
	multiple,
	name,
	onSelect,
	optionBgActive,
	optionBgHover,
	optionTextActive,
	optionTextColor,
	optionTextHover,
	options,
	padding,
	placeholder,
	placeholderImage,
	rounded,
	textSize,
	value,
}) => {
	const bgColor = disabled ? "bg-gray-500" : bg;

	const borderColor = disabled
		? "border-transparent"
		: error
		? "border-red-500"
		: bdrColor;

	const _labelColor = disabled
		? "text-gray-500"
		: error
		? "text-red-500"
		: labelColor
		? labelColor
		: "text-primary-500";

	const { buttonRef, ref, setVisible, visible } = useOutClick<
		HTMLUListElement,
		HTMLButtonElement
	>();
	const iconTextColor = disabled ? "text-white" : iconColor;

	const textColor = disabled ? "text-white" : value ? color : "text-gray-400";

	return (
		<div>
			{(label || badge || btn) && (
				<div className="flex items-center justify-between mb-2">
					{label && (
						<label
							className={`${_labelColor} ${labelSize} block capitalize font-semibold`}
							htmlFor={name}
						>
							{label}
						</label>
					)}
					{btn && (
						<div>
							<Button
								bold="normal"
								caps
								padding="p-2"
								titleSize="text-xs"
								type="button"
								{...btn}
							/>
						</div>
					)}
					{badge && (
						<div>
							<Badge {...badge} />
						</div>
					)}
				</div>
			)}
			<div className="mt-1 relative">
				<button
					ref={buttonRef}
					onClick={() => setVisible(!visible)}
					type="button"
					className={`${bgColor} ${
						disabled ? "cursor-not-allowed" : "cursor-pointer"
					} ${padding} ${bdr} ${borderColor} ${rounded} ${textSize} ${focus} ${focusColor} min-h-[36px] relative shadow-sm w-full`}
				>
					<span className="flex items-center">
						{Icon ? (
							<Icon className={`${iconTextColor} mx-2 ${iconSize}`} />
						) : (
							placeholderImage && (
								<img
									src={placeholderImage}
									alt=""
									className={`flex-shrink-0 ${imageSize} rounded-full`}
								/>
							)
						)}

						<span className={`${textColor} ml-3 block truncate`}>
							{placeholder}
						</span>
					</span>
					<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<FaChevronDown className={`text-xs ${iconTextColor}`} />
					</span>
				</button>
				{error && (
					<p
						className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}
					>
						{error}
					</p>
				)}
				{options && disabled === false && (
					<ul
						ref={ref}
						className={`${
							visible ? "opacity-100 visible" : "opacity-0 invisible"
						} ${rounded} ${textSize} ${divide} ${divideColor} absolute bg-white z-20 w-full shadow-lg transition ease-in duration-100 max-h-56 ring-1 ring-black ring-opacity-50 overflow-x-hidden overflow-y-auto focus:outline-none`}
					>
						{options.map((option, index) => {
							const active =
								multiple && Array.isArray(value)
									? Boolean(
											value.find(
												(item: string | number) => item === option.value
											)
									  )
									: option.value === value;

							return (
								<li
									key={index}
									className={`${
										active ? optionBgActive : bgColor
									} ${optionBgHover} ${
										active ? optionTextActive : optionTextColor
									} ${optionTextHover}
										cursor-pointer select-none relative py-2 pl-3 pr-9
									`}
									onClick={
										disabled === false && onSelect
											? () => {
													onSelect({
														title: option.title,
														value: option.value,
													});
													if (closeOnClick && multiple === false)
														setVisible(false);
											  }
											: () => {}
									}
								>
									<div className="flex items-center">
										{option.Icon ? (
											<option.Icon
												className={`${iconTextColor} mx-2 ${iconSize}`}
											/>
										) : (
											option.image && (
												<img
													src={option.image}
													alt=""
													className={`flex-shrink-0 ${imageSize} rounded-full`}
												/>
											)
										)}

										<span className="font-normal ml-3 block truncate">
											{option.title}
										</span>
									</div>
									{active && (
										<span className="absolute inset-y-0 right-0 flex items-center pr-4">
											<FaCheck className="text-xs md:text-sm" />
										</span>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

Select.defaultProps = {
	bg: "bg-transparent",
	bdr: "border",
	bdrColor: "border-gray-300",
	color: "text-gray-700",
	closeOnClick: true,
	errorSize: "text-xs",
	focus: "focus:outline-none focus:ring-1",
	focusColor: "focus:ring-primary-500 focus:border-primary-500",
	iconColor: "text-primary-500",
	iconSize: "text-xs",
	labelSize: "text-xs md:text-sm",
	imageSize: "h-6 w-6",
	multiple: false,
	optionBgActive: "bg-primary-500",
	optionBgHover: "hover:bg-primary-500",
	optionTextActive: "text-gray-100",
	optionTextColor: "text-gray-900",
	optionTextHover: "hover:text-gray-100",
	padding: "pl-3 pr-10 py-2",
	rounded: "rounded-md",
	textSize: "text-xs md:text-sm",
};

export default Select;

// import { DEFAULT_IMAGE } from "@/config";

// const Select = () => {
// 	return (
// 		<div>
// 			<label className="block text-sm font-medium text-gray-700">
// 				{" "}
// 				Assigned to{" "}
// 			</label>
// 			<div className="mt-1 relative">
// 				<button
// 					type="button"
// 					className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
// 				>
// 					<span className="flex items-center">
// 						<img
// 							src={DEFAULT_IMAGE}
// 							alt=""
// 							className="flex-shrink-0 h-6 w-6 rounded-full"
// 						/>
// 						<span className="ml-3 block truncate"> Tom Cook </span>
// 					</span>
// 					<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
// 						<svg
// 							className="h-5 w-5 text-gray-400"
// 							xmlns="http://www.w3.org/2000/svg"
// 							viewBox="0 0 20 20"
// 							fill="currentColor"
// 							aria-hidden="true"
// 						>
// 							<path
// 								fill-rule="evenodd"
// 								d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
// 								clip-rule="evenodd"
// 							/>
// 						</svg>
// 					</span>
// 				</button>

// 				{
//       Select popover, show/hide based on select state.

//       Entering: ""
//         From: ""
//         To: ""
//       Leaving: "transition ease-in duration-100"
//         From: "opacity-100"
//         To: "opacity-0"}
// }
// 				<ul
// 					className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
// 				>
// 					{/* Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

//         Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"*/}

// 					<li
// 						className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
// 					>
// 						<div className="flex items-center">
// 							<img
// 								src={DEFAULT_IMAGE}
// 								alt=""
// 								className="flex-shrink-0 h-6 w-6 rounded-full"
// 							/>

// 							<span className="font-normal ml-3 block truncate">
// 								{" "}
// 								Wade Cooper{" "}
// 							</span>
// 						</div>

// 						<span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
// 							<svg
// 								className="h-5 w-5"
// 								xmlns="http://www.w3.org/2000/svg"
// 								viewBox="0 0 20 20"
// 								fill="currentColor"
// 								aria-hidden="true"
// 							>
// 								<path
// 									fill-rule="evenodd"
// 									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
// 									clip-rule="evenodd"
// 								/>
// 							</svg>
// 						</span>
// 					</li>
// 				</ul>
// 			</div>
// 		</div>
// 	);
// };
