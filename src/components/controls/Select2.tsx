import { FC } from "react";
import { IconType } from "react-icons";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import Badge, { BadgeProps } from "../common/Badge";
import Button, { ButtonProps } from "./Button";
import { useOutClick } from "../../hooks";
import { toCapitalize } from "../../utils";

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
	onSelect: (e: { title: string; value: string }) => void;
	optionBgActive?: string;
	optionBgHover?: string;
	optionTextActive?: string;
	optionTextColor?: string;
	optionTextHover?: string;
	options: {
		Icon?: IconType;
		image?: string;
		title: string;
		value: string;
	}[];
	padding?: string;
	placeholder?: string;
	placeholderImage?: string;
	rounded?: string;
	required?: boolean;
  requiredColor?: string;
	textSize?: string;
	value: string | string[];
};

const getTitle = (options: {title: string; value: string}[], value: string | string[]): string => {
	const titles: string[] = []
	if (Array.isArray(value)) {
		value.forEach(val => {
			const option = options.find(option => option.value === val)
			if (option) titles.push(toCapitalize(String(option.title)))
		})
	} else {
		const option = options.find(option => option.value === value)
		if (option) titles.push(toCapitalize(String(option.title)))
	}
	if (titles.length > 0) return titles.join(", ")
	return ""
}

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
	required,
  requiredColor,
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

	const isAnArray = value ? Array.isArray(value) : false;

	const containsValue = value ? isAnArray && value.length > 0 && true : false

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
							{required && (
                <span className={`${requiredColor || "text-red-500"} mx-1`}>
                  *
                </span>
              )}
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
							{containsValue ? getTitle(options, value) : placeholder}
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
									? 
										Boolean(value.find(
											(item: string) => item === option.value
										))
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
	disabled: false,
	errorSize: "text-xs",
	focus: "focus:outline-none focus:ring-1",
	iconColor: "text-primary-500",
	iconSize: "text-xs",
	labelSize: "text-xs md:text-sm",
	imageSize: "h-6 w-6",
	multiple: false,
	optionBgActive: "bg-gray-300",
	optionBgHover: "hover:bg-gray-100",
	optionTextActive: "text-gray-700",
	optionTextColor: "text-gray-900",
	optionTextHover: "hover:text-gray-700",
	padding: "pl-3 pr-10 py-2",
	rounded: "rounded-md",
	required: true,
  requiredColor: "text-red-500",
	textSize: "text-xs md:text-sm",
};

export default Select;
