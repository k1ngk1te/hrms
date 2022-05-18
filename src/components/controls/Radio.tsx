import { ChangeEvent, useState } from "react";

const radioStyle = "border border-gray-400 cursor-pointer flex items-center p-4 rounded-md shadow-lg w-full hover:bg-gray-400 hover:text-primary-500";
const labelStyle = "font-semibold inline-block mx-3 text-xs md:text-sm";

type RadioProps = {
	active?: boolean;
	id: string;
	label: string;
	name: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	value: string;
}

const Radio = ({ active, id, label, name, onChange, required, value, ...props }: RadioProps) => {
	const [hovering, setHovering] = useState<boolean>(false);

	return (
		<label 
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className={`${active ? "bg-gray-400" : ""} ${radioStyle}`}
			htmlFor={id}
		>
			<input 
				id={id} 
				onChange={onChange}
				name={name}
				type="radio" 
				required={required}
				value={value} 
				{...props} 
			/>
			<span 
				className={`${active ? "text-primary-500" : "text-gray-500"} ${hovering ? "text-primary-500" : ""} ${labelStyle}`} 
			>
				{label}
			</span>
		</label>
	)
}

export default Radio;