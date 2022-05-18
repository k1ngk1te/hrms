import { Button } from "../../controls";
import { ButtonProps as ButtonTypes } from "../../controls/Button";

export interface ButtonProps extends ButtonTypes {
	color?: string
}

const DecisionButton = ({ color, title, ...props }: ButtonProps) => {
	const _color = 
		color === "danger"
			? "bg-red-500 hover:bg-red-600"
			: color === "info"
			? "bg-gray-500 hover:bg-gray-600"
			: color === "pacify"
			? "bg-blue-500 hover:bg-blue-600"
			: color === "primary"
			? "bg-primary-500 hover:bg-primary-600"
			: color === "secondary"
			? "bg-secondary-500 hover:bg-secondary-600"
			: color === "success"
			? "bg-green-500 hover:bg-green-600"
			: color === "warning"
			? "bg-yellow-500 hover:bg-yellow-600"
			: "bg-gray-500 hover:bg-gray-600"

	return <Button bg={_color} title={title} {...props} />
}

DecisionButton.defaultProps = {
	bold: false,
	caps: true,
	padding: "px-3 py-1",
	rounded: "rounded-md",
}

export default DecisionButton;