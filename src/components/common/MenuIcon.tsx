import { forwardRef } from "react";

type IconProps = {
	color?: "danger" | "info" | "pacify" | "primary" | "secondary" | "success" | "warning";
	setVisible: (value: boolean) => void;
	visible: boolean;
}

const Icon = forwardRef<HTMLDivElement, IconProps>((props: IconProps, ref) => {
	const { color, setVisible, visible } = props;

	const bg = 
		color === "success"
			? "bg-green-500"
			: color === "danger"
			? "bg-red-500"
			: color === "warning"
			? "bg-yellow-500"
			: color === "pacify"
			? "bg-blue-500"
			: color === "info"
			? "bg-gray-500"
			: color === "primary"
			? "bg-primary-500"
			: color === "secondary"
			? "bg-secondary-500"
			: "bg-green-500";

	return (
    <div
      onClick={() => setVisible(!visible)}
      ref={ref}
      className="cursor-pointer duration-500 flex flex-col justify-around transform transition-all w-6 hover:scale-105"
      style={{ height: "1.125rem" }}
    >
      <div
        className={`${bg} w-full`}
        style={{ height: "2px", visibility: visible ? "collapse" : "visible" }}
      />
      <div className="relative">
        <div
          className={`${
            visible ? "rotate-45" : "rotate-0"
          } ${bg} absolute duration-500 top-1/2 transform transition-all w-full`}
          style={{
            height: "2px",
            visibility: visible ? "visible" : "collapse",
          }}
        />
        <div
          className={`${bg} w-full`}
          style={{
            height: "2px",
            visibility: visible ? "collapse" : "visible",
          }}
        />
        <div
          className={`${
            visible ? "-rotate-45" : "rotate-0"
          } ${bg} absolute duration-500 top-1/2 transform transition-all w-full`}
          style={{
            height: "2px",
            visibility: visible ? "visible" : "collapse",
          }}
        />
      </div>
      <div
        className={`${bg} w-full`}
        style={{ height: "2px", visibility: visible ? "collapse" : "visible" }}
      />
    </div>
  )
});

export default Icon;