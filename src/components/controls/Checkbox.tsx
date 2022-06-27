import { ChangeEvent, CSSProperties } from "react";

export type CheckboxProps = {
  caps?: boolean | "upper";
  between?: boolean;
  centered?: boolean;
  disabled?: boolean;
  error?: string;
  errorSize?: string;
  label?: string;
  labelColor?: string;
  labelSize?: string;
  labelStyle?: CSSProperties;
  margin?: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  requiredColor?: string;
  reverse?: boolean;
  textSize?: string;
  type?: "checkbox" | "switch";
  value: boolean;
};

const Checkbox = ({
  caps,
  between,
  centered,
  disabled,
  error,
  errorSize,
  label,
  labelColor,
  labelSize,
  labelStyle,
  margin,
  name,
  onChange,
  required,
  requiredColor,
  reverse,
  textSize,
  type,
  value,
  ...props
}: CheckboxProps) => {
  return (
    <>
      <label
        className={`${centered ? "justify-center" : between ? "justify-between" : ""} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${reverse ? "flex-row-reverse" : "flex-row"} flex font-bold items-center ${labelColor}`}
        style={{
          ...labelStyle
        }}
      >
        <div
          className={`${
            disabled
              ? "bg-gray-500"
              : value === null || value === undefined || value === false
              ? "bg-gray-300 transition-colors"
              : "bg-primary-100 transition-colors"
          } ${type === "switch" ? "" : "hidden"} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } duration-1000 rounded-lg flex items-center h-3 mr-2 transform w-7`}
        >
          <div
            className={`${
              value === null || value === undefined || value === false
                ? `${disabled ? "bg-gray-700" : "bg-gray-400 transition-all"}`
                : `${
                    disabled ? "bg-gray-700" : "bg-primary-500 transition-all "
                  } translate-x-4`
            } duration-500 h-4 rounded-full shadow-lg transform w-4`}
          />
        </div>
        <input
          className={`${type === "switch" ? "hidden" : ""} ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${textSize} ${margin} leading-tight`}
          disabled={disabled}
          name={name}
          onChange={onChange}
          required={required}
          type="checkbox"
          checked={value === null || value === undefined ? false : value}
          {...props}
        />
        {label && (
          <span
            className={`${
              caps === false
                ? ""
                : caps === "upper"
                ? "uppercase"
                : "capitalize"
            } ${labelSize}`}
          >
            {label}
            {required && (
              <span className={`${requiredColor || "text-red-500"} mx-1`}>
                *
              </span>
            )}
          </span>
        )}
      </label>
      {error && (
        <p className={`capitalize font-primary font-semibold italic mt-1 text-red-500 ${errorSize}`}>
          {error}
        </p>
      )}
    </>
  );
};

Checkbox.defaultProps = {
  between: false,
  centered: false,
  reverse: false,
  required: true,
  requiredColor: "text-red-500",
  margin: "mr-2",
  errorSize: "text-xs",
  labelColor: "text-primary-500",
  labelSize: "text-xs md:text-sm",
  textSize: "text-xs md:text-sm"
};

export default Checkbox;
