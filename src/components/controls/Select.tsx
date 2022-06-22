import { ChangeEvent } from "react";
import { IconType } from "react-icons";
import { FaChevronDown } from "react-icons/fa";
import Badge, { BadgeProps } from "../common/Badge";
import Button, { ButtonProps } from "./Button";

type SelectProps = {
  badge?: BadgeProps;
  bg?: string;
  bdr?: string;
  bdrColor?: string;
  btn?: ButtonProps;
  color?: string;
  disabled?: boolean;
  error?: string;
  errorSize?: string;
  Icon?: IconType;
  iconColor?: string;
  iconClass?: string;
  iconSize?: string;
  label?: string;
  labelColor?: string;
  labelSize?: string;
  multiple?: boolean;
  name?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: {
    title?: string;
    value?: string | number;
  }[];
  padding?: string;
  placeholder?: string;
  required?: boolean;
  requiredColor?: boolean;
  rounded?: string;
  textSize?: string;
  value: string | number;
};

const Select = ({
  badge,
  bg,
  bdr,
  bdrColor,
  btn,
  color,
  disabled,
  error,
  errorSize,
  Icon,
  iconColor,
  iconClass,
  iconSize,
  label,
  labelColor,
  labelSize,
  multiple,
  name,
  onChange,
  options,
  padding,
  placeholder,
  required,
  requiredColor,
  rounded,
  textSize,
  value,
  ...props
}: SelectProps) => {
  const bgColor = disabled ? "bg-gray-500" : bg;

  const borderColor = disabled
    ? "border-transparent"
    : error
    ? "border-red-500"
    : bdrColor;

  const iconBgColor = disabled ? bgColor : value ? "bg-gray-100" : bgColor;
  const iconTextColor = disabled ? "text-white" : iconColor;

  const _labelColor = disabled
    ? "text-gray-500"
    : error
    ? "text-red-500"
    : labelColor
    ? labelColor
    : "text-primary-500";

  const textColor = disabled
    ? "text-white"
    : value
    ? color
    : "text-gray-400";

  return (
    <>
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
      <div
        className={` ${bgColor} ${borderColor} ${rounded} ${bdr}  ${
          Icon ? "flex items-center" : ""
        } relative w-full`}
      >
        {Icon && (
          <Icon className={`${iconBgColor} ${iconTextColor} ${iconClass} ${iconSize}`} />
        )}
        <select
          className={`${textColor} ${padding} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${textSize} ${rounded} appearance-none bg-transparent block leading-tight pr-8 shadow-lg w-full focus:bg-gray-100 focus:border-primary-300 focus:outline-none`}
          disabled={disabled}
          name={name}
          onChange={onChange}
          value={value}
          multiple={multiple}
          required={required}
          {...props}
        >
          {placeholder && (
            <option className="capitalize cursor-pointer" value="">{placeholder}</option>
          )}
          {options?.map(({ title, value }) => (
            <option
              key={value}
              className="capitalize cursor-pointer"
              value={value}
            >
              {title}
            </option>
          ))}
        </select>
        <div className="absolute flex inset-y-0 items-center pointer-events-none px-2 right-2 text-gray-700">
          <span className="text-xs">
            <FaChevronDown />
          </span>
        </div>
      </div>
      {error && (
        <p className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}>
          {error}
        </p>
      )}
    </>
  );
};

Select.defaultProps = {
  bg: "bg-transparent",
  bdr: "border",
  bdrColor: "border-primary-500",
  color: "text-gray-700",
  errorSize: "text-xs",
  iconColor: "text-primary-500",
  iconSize: "text-xs",
  iconClass: "mx-2",
  labelSize: "text-xs md:text-sm",
  multiple: false,
  padding: "px-3 py-2",
  rounded: "rounded",
  required: true,
  requiredColor: "text-red-500",
  textSize: "text-xs md:text-sm"
};

export default Select;
