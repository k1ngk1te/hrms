import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import Loader from "./Loader";

interface ContainerProps extends ButtonProps {
  children: React.ReactNode;
  className: string;
  link?: string;
  ref?: any;
}

export const Container = forwardRef<HTMLButtonElement | null, ContainerProps>(
  ({ children, link, ...props }, ref) =>
    link ? (
      <Link to={link}>
        <span {...props}>{children}</span>
      </Link>
    ) : (
      <button {...props} ref={ref}>
        {children}
      </button>
    )
);

const Button = ({
  bg,
  bold,
  border,
  caps,
  color,
  disabled,
  focus,
  iconSize,
  IconLeft,
  IconRight,
  link,
  loader,
  loading,
  margin,
  onClick,
  padding,
  rounded,
  title,
  titleSize,
  type,
  ...props
}: ButtonProps) => {
  const bgColor = disabled ? "bg-gray-500" : bg;

  const fontWeight =
    bold === "thin"
      ? "font-thin"
      : bold === "extralight"
      ? "font-extralight"
      : bold === "light"
      ? "font-light"
      : bold === "normal"
      ? "font-normal"
      : bold === "medium"
      ? "font-medium"
      : bold === "semibold"
      ? "font-semibold"
      : bold === "bold"
      ? "font-bold"
      : bold === "extrabold"
      ? "font-extrabold"
      : bold === "black"
      ? "font-black"
      : "font-normal";

  const textTrans = caps ? "capitalize" : "uppercase";

  return (
    <div className="relative w-full">
      <Container
        className={`${bgColor} ${focus} ${rounded} ${textTrans} ${fontWeight} ${
          margin || ""
        } ${padding} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${border} ${color} ${titleSize} flex items-center justify-center text-center tracking-wide w-full focus:outline-none focus:shadow-outline`}
        disabled={disabled}
        link={link}
        onClick={onClick}
        title={title}
        type={type}
        {...props}
      >
        {loader === true && loading === true ? (
          <Loader color="white" size={4} type="dashed" width="xs" />
        ) : (
          <>
            {IconLeft && (
              <span className="flex items-center justify-center mx-2 text-xs">
                <IconLeft className={`${color} ${iconSize}`} />
              </span>
            )}
            <span className="flex items-center justify-center">
              {title}
            </span>
            {IconRight && (
              <span className="flex items-center justify-center mx-2 text-xs">
                <IconRight className={`${color} ${iconSize}`} />
              </span>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

Button.defaultProps = {
  bg: "bg-primary-500 hover:bg-primary-400",
  bold: "font-semibold",
  border: "border-none",
  caps: false,
  color: "text-white",
  focus: "",
  iconSize: "text-xs md:text-sm",
  padding: "px-4 py-2",
  rounded: "rounded",
  ref: null,
  titleSize: "text-xs md:text-sm",
  type: "submit",
};

export interface ButtonProps {
  bg?: string;
  bold?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  border?: string;
  caps?: boolean;
  color?: string;
  disabled?: boolean;
  focus?: string;
  iconSize?: string;
  IconLeft?: IconType;
  IconRight?: IconType;
  link?: string;
  loader?: boolean;
  loading?: boolean;
  margin?: string;
  onClick?: () => void;
  padding?: string;
  rounded?: string;
  title: string;
  titleSize?: string;
  type?: "button" | "submit";
}

export default Button;
