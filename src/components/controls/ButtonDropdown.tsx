import { CSSProperties } from "react";
import { FaChevronDown, FaChevronRight, FaTimes } from "react-icons/fa";
import { useOutClick } from "../../hooks";
import Button, { ButtonProps } from "./Button";

const dropdownStyle =
  "absolute bg-gray-100 duration-500 p-1 rounded transform shadow-lg transition-opacity w-full";

type DropdownProps = {
  list: {
    title: string;
    onClick: () => void;
  }[];
  setVisible: (value: boolean) => void;
};

const Dropdown = ({ list, setVisible }: DropdownProps) => (
  <ul className="divide-y divide-gray-300 divide-opacity-50">
    {list?.map(({ onClick, title, ...props }) => (
      <li
        className="cursor-pointer px-5 py-1 text-gray-500 hover:bg-gray-200 hover:text-primary-500"
        key={title}
        onClick={() => {
          onClick();
          setVisible(false);
        }}
        {...props}
      >
        <span className="capitalize text-xs md:text-sm">{title}</span>
      </li>
    ))}
  </ul>
);

type ButtonDropProps = {
  component?: any; // new() => React.Component<any, any>;
  props: ButtonProps;
  dropList?: {
    title: string;
    onClick: () => void;
  }[];
  style?: CSSProperties;
};

const ButtonDropdown = ({
  component,
  dropList,
  props,
  style,
}: ButtonDropProps) => {
  const controls = useOutClick<HTMLDivElement, HTMLDivElement>();

  return (
    <div className="relative" style={{ ...style }}>
      <div ref={controls.buttonRef}>
        <Button
          bold="normal"
          caps
          IconRight={controls.visible ? FaChevronDown : FaChevronRight}
          onClick={() => controls.setVisible(!controls.visible)}
          rounded="rounded-xl"
          {...props}
        />
      </div>

      {controls.visible && (
        <div
					ref={controls.ref}
          className={`${
            controls.visible
              ? "opacity-100 visible z-40"
              : "invisible opacity-0 z-0"
          } ${dropdownStyle}`}
          style={{ boxShadow: "5px 5px 5px 5px #bbb" }}
        >
          <div className="bg-white rounded">
            <div className="flex justify-end">
              <span
                className="cursor-pointer mx-2 text-primary-500"
                onClick={() => controls.setVisible(false)}
              >
                <FaTimes className="text-xs text-primary-500 sm:text-sm" />
              </span>
            </div>
            {dropList ? (
              <Dropdown list={dropList} setVisible={controls.setVisible} />
            ) : (
              component
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonDropdown;
