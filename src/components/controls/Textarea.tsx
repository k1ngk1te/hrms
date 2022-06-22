import { ChangeEvent, CSSProperties } from "react";
import Badge, { BadgeProps } from "../common/Badge";
import Button, { ButtonProps } from "./Button";

type TextareaProps = {
  badge?: BadgeProps;
  bg?: string;
  bdr?: string;
  bdrColor?: string;
  btn?: ButtonProps;
  color?: string;
  disabled?: boolean;
  error?: string;
  errorSize?: string;
  label?: string;
  labelColor?: string;
  labelSize?: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  placeholderColor?: string;
  rounded?: string;
  required?: boolean;
  requiredColor?: string;
  style?: CSSProperties;
  textSize?: string;
  value: string;
};

const Textarea = ({
  badge,
  bg,
  bdr,
  bdrColor,
  btn,
  color,
  disabled,
  error,
  errorSize,
  label,
  labelColor,
  labelSize,
  name,
  onChange,
  placeholder,
  placeholderColor,
  rounded,
  required,
  requiredColor,
  style,
  textSize,
  value,
  ...props
}: TextareaProps) => {
  const bgColor = disabled ? "bg-gray-500" : bg;

  const borderColor = disabled
    ? "border-transparent"
    : error
    ? "border-red-500"
    : bdrColor
    ? bdrColor
    : "border-primary-500";

  const _labelColor = disabled
    ? "text-gray-500"
    : error
    ? "text-red-500"
    : labelColor
    ? labelColor
    : "text-primary-500";

  const textColor = disabled ? placeholderColor : color;

  return (
    <>
      {(label || badge || btn) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label
              className={`${_labelColor} block capitalize font-semibold ${labelSize}`}
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
        className={`${borderColor} ${bgColor} ${rounded} ${bdr} shadow-lg w-full`}
      >
        <textarea
          className={`${bgColor} ${textColor} ${textSize} apperance-none leading-tight px-3 py-2 resize w-full focus:outline-none focus:shadow-outline`}
          disabled={disabled}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          value={value}
          style={style}
          {...props}
        />
      </div>
      {error && (
        <p
          className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}
        >
          {error}
        </p>
      )}
    </>
  );
};

Textarea.defaultProps = {
  bg: "bg-transparent",
  bdr: "border",
  color: "text-gray-600",
  errorSize: "text-xs",
  labelSize: "text-xs md:text-sm",
  placeholderColor: "placeholder-white text-white",
  required: true,
  requiredColor: "text-red-500",
  rounded: "rounded",
  textSize: "text-xs md:text-sm",
};

export default Textarea;
