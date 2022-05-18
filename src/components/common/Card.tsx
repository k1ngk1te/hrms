import { FC } from "react";
import { IconType } from "react-icons";

type CardProps = {
	bgColor?: string;
	Icon?: IconType;
	iconBg?: string;
	image?: string;
	txtColor?: string;
	title: string;
	value: number | string;
	zigzag?: 0 | 1 | 2;
}

const CardIcon = ({ Font, iconBg, txtColor }: { Font:IconType; iconBg?:string; txtColor?: string }) => (
	<div className={`${iconBg || "bg-white"} px-3 py-2 rounded-l-md`}>
		<Font className={`${txtColor || "text-white"} text-3xl md:text-4xl`} />
	</div>
)

const Image = ({ alt, src }: { alt: string; src: string; }) => (
	<div className="bg-white px-3 py-2 rounded-l-md">
		<div className="bg-white h-[50px] rounded-md w-[50px]">
			<img
				className="bg-white h-full rounded-md w-full"
				src={src}
				alt={alt}
			/>
		</div>
	</div>
)

const Card: FC<CardProps> = ({ bgColor, Icon, iconBg, image, txtColor, title, value, zigzag }) => (
	<section
		className={`${bgColor} font-calibri py-4 relative rounded-lg shadow-lg w-full`}
	>
		<div className="flex justify-between items-center my-6">
			<div className="ml-4">
				<p className="capitalize text-gray-100 text-sm tracking-wide uppercase md:text-base lg:text-lg">
					{title}
				</p>
				<h3 className="font-bold my-1 text-gray-100 text-xl tracking-wider uppercase md:text-2xl lg:text-3xl">
					{value}
				</h3>
			</div>
			{image ? 
				<Image alt={title} src={image} /> : Icon &&
				<CardIcon Font={Icon} iconBg={iconBg} txtColor={txtColor} />
			}
		</div>
		{zigzag !== 0 && (
			<div className="flex items-center justify-around my-2">
				<span> </span>
				<div>
					<div className="h-[6px] w-[30px]">
						<img
							className="h-full w-full"
							alt="zigzag"
							src={`/static/images/zigzag-icon-${zigzag}.svg`}
						/>
					</div>
				</div>
			</div>
		)}
	</section>
);

Card.defaultProps = {
	bgColor: "bg-gradient-to-tr from-primary-500 via-primary-300 to-gray-300",
	txtColor: "text-white",
	zigzag: 1,
}

export default Card;
