import { useEffect, useState } from "react";
import {
  FaTimesCircle,
  FaGem,
  FaInfoCircle,
  FaChevronCircleRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGrinHearts
} from "react-icons/fa";

type ColorTypes =
  | "danger"
  | "info"
  | "main"
  | "pacify"
  | "success"
  | "warning";

export type AlertProps = {
  message?: string;
  onClick?: () => void;
  rounded?: string;
  type?: ColorTypes;
  visible?: boolean;
};

const Icon = ({ type }: { type?: ColorTypes }) => {
  function getIcon() {
    switch (type) {
			case "danger":
				return FaTimesCircle;
			case "info":
				return FaGem;
			case "main":
				return FaInfoCircle;
			case "pacify":
				return FaChevronCircleRight;
      case "success":
        return FaCheckCircle;
			case "warning":
				return FaExclamationTriangle;
			default:
				return FaGrinHearts;
    }
  }
  const Value= getIcon()
  return <Value className="h-4 w-4 mr-2" />
};

const classes =
  "p-3 text-sm inline-flex items-center justify-between w-full sm:px-4 md:px-6 md:py-5 md:text-base";

const Alert = ({ message, onClick, rounded, type, visible }: AlertProps) => {
  const [_visible, setVisible] = useState(false);

  const visibility = visible !== undefined ? visible : _visible;

  const color =
    type === "danger"
      ? "bg-red-100 text-red-700"
      : type === "info"
			? "bg-gray-300 text-gray-800"
			: type === "main"
			? "bg-blue-100 text-blue-700"
			: type === "pacify"
			? "bg-indigo-100 text-indigo-700"
			: type === "success"
      ? "bg-green-100 text-green-700"
			: type === "warning"
			? "bg-yellow-100 text-yellow-700"
      : "bg-gray-50 text-gray-500";

  useEffect(() => {
    if (visible === undefined) {
      if (message) setVisible(true);
      else if (message === null && message === undefined) setVisible(false);
    }
  }, [message, visible]);

  return visibility ? (
    <div className={`${color} ${rounded} ${classes}`}>
      <div className="inline-flex items-center">
        <Icon type={type} />
        {message}
      </div>
      <div>
        <span
          onClick={() => {
            visible === undefined && setVisible(false)
            onClick && onClick()
          }}
          className="cursor-pointer"
        >
          <FaTimesCircle className="h-4 w-4" />
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
};

Alert.defaultProps = {
  message: "",
  rounded: "rounded-lg",
  type: "success",
};

export default Alert;