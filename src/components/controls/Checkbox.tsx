import { ChangeEvent } from "react";

export type CheckboxProps = {
  caps?: boolean | "upper";
  centered?: boolean;
  disabled?: boolean;
  error?: string;
  errorSize?: string;
  label?: string;
  labelColor?: string;
  labelSize?: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  textSize?: string;
  type?: "checkbox" | "switch";
  value: boolean;
};

const Checkbox = ({
  caps,
  centered,
  disabled,
  error,
  errorSize,
  label,
  labelColor,
  labelSize,
  name,
  onChange,
  required,
  textSize,
  type,
  value,
  ...props
}: CheckboxProps) => {
  return (
    <>
      <label
        className={`${centered ? "justify-center" : ""} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } block flex font-bold items-center ${labelColor}`}
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
          } ${textSize} mr-2 leading-tight`}
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
  centered: false,
  errorSize: "text-xs",
  labelColor: "text-primary-500",
  labelSize: "text-xs md:text-sm",
  required: true,
  textSize: "text-xs md:text-sm"
};

export default Checkbox;
