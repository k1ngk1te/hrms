import { FC } from "react";
import { IconType } from "react-icons";
import { FaCalendar } from "react-icons/fa";
import Badge, { BadgeProps } from "../common/Badge";
import Calendar from "../common/Calendar"
import Button, { ButtonProps } from "./Button";
import { useOutClick } from "../../hooks";

export type DateInputProps = {
	badge?: BadgeProps;
	bg?: string;
	bdr?: string;
	bdrColor?: string;
	btn?: ButtonProps;
	color?: string;
	disabled?: boolean;
	error?: string;
	errorSize?: string;
	focus?: string;
	focusColor?: string;
	helpText?: string;
	helpTextColor?: string;
	helpTextSize?: string;
	Icon?: IconType;
	iconColor?: string;
	label?: string;
	labelColor?: string;
	labelSize?: string;
	onChange?: (e: Date) => void;
	name?: string;
	padding?: string;
	placeholder?: string;
	placeholderColor?: string;
	required?: boolean;
	rounded?: string;
	textSize?: string;
	type?: string;
	value: string | Date;
};

const DateInput: FC<DateInputProps> = ({
	badge,
	bg,
	bdr,
	bdrColor,
	btn,
	color,
	disabled,
	error,
	errorSize,
	focus,
	focusColor,
	helpText,
	helpTextColor,
	helpTextSize,
	Icon,
	iconColor,
	label,
	labelColor,
	labelSize,
	onChange,
	name,
	padding,
	placeholder,
	placeholderColor,
	rounded,
	required,
	textSize,
	type,
	value,
	...props
}) => {
	let dateValue = value ? typeof value === "string" ? new Date(value) : value : undefined;

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
		HTMLDivElement,
		HTMLButtonElement
	>();
	const iconTextColor = disabled ? "text-white" : iconColor;

	const textColor = disabled ? "text-white" : dateValue ? color : "text-gray-400";

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
						{Icon && (
							<Icon className={`${iconTextColor} mx-2 ${iconSize}`} />
						)}
						<span className={`${textColor} block truncate`}>
							{placeholder}
						</span>
					</span>
					<span className="mx-1 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<FaCalendar className={`text-xs ${iconTextColor}`} />
					</span>
				</button>
				<div
					className={`${visible ? "block" : "hidden"} absolute top-[-354px] left-0`}
					ref={ref}
				>
					<Calendar value={dateValue} />
				</div>
				{error && (
					<p
						className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}
					>
						{error}
					</p>
				)}
				{helpText && (
					<p
						className={`font-secondary font-semibold mt-1 px-1 ${helpTextColor} ${helpTextSize}`}
					>
						{helpText}
					</p>
				)}
			</div>
		</div>
	);
};

DateInput.defaultProps = {
	bg: "bg-transparent",
	bdr: "border",
	bdrColor: "border-primary-500",
	color: "text-gray-600",
	errorSize: "text-xs",
	focus: "focus:outline-none focus:ring-1",
	focusColor: "focus:ring-primary-500 focus:border-primary-500",
	helpTextColor: "text-gray-400",
	helpTextSize: "text-xs",
	iconColor: "text-primary-500",
	labelSize: "text-xs md:text-sm",
	padding: "px-3 py-2",
	placeholderColor: "placeholder-white text-white",
	required: true,
	rounded: "rounded",
	textSize: "text-xs md:text-sm",
	type: "text",
};

export default DateInput;

