import { FC } from "react";
import { FaArrowUp } from "react-icons/fa";

const scrollStyle = `
  bg-secondary-500 bottom-5 cursor-pointer duration-500 fixed flex font-bold 
  items-center justify-center right-5 rounded-lg p-3 text-gray-100 transition-all 
  transform hover:opacity-100 hover:scale-110 md:bottom-6 md:right-6 lg:bottom-8 
  lg:right-8
`;

type Props = {
	onClick: () => void;
	visible: boolean;
}

const ScrollToTop: FC<Props> = ({ onClick, visible }) => {
	const iconStyle = visible
		? "opacity-0 invisible translate-y-4"
		: "opacity-50 visible translate-y-0";

	return (
		<div
			onClick={onClick}
			className={scrollStyle + " " + iconStyle}
			style={{ zIndex: 120 }}
		>
			<FaArrowUp className="fas fa-arrow-up" style={{ fontSize: "12px" }} />
		</div>
	);
};

export default ScrollToTop;
