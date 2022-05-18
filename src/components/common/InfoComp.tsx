import { FC } from "react";
import Badge from "./Badge";

type InfoCompType = {
	image?: {
		className?: string;
		src: string;
		alt: string;
	};
	infos: {
		options?: any;
		title: string;
		type?: "badge";
		value: string;
	}[];
	title: string;
	titleWidth?: string;
}

const InfoComp: FC<InfoCompType> = ({ image, infos, title, titleWidth }) => (
	<div className="bg-white mt-4 mb-4 p-2 rounded-lg shadow-lg">
		<h4 className="capitalize font-bold mt-2 mb-1 text-lg text-primary-500 underline">
			{title}
		</h4>
		{image && (
			<div className="relative w-full">
				<div className="h-[150px] w-[150px] relative md:h-[200px] md:w-[200px]">
					<img className="h-full w-full" {...image} />
				</div>
			</div>
		)}
		<div className="divide-y divide-gray-500 divide-opacity-25">
			{infos.map((info, id) => (
				<div key={id} className="flex items-start py-3">
					<p className={`font-medium mx-1 text-sm text-gray-800 ${titleWidth || "w-[120px]"}`}>
						{`${info.title} :`}
					</p>
					{info?.type === "badge" ? (
						<div className="font-medium w-full">
							<div className="max-w-[120px]">
								<Badge margin="mx-1" title={info.value} {...info.options} />
							</div>
						</div>
					) : (
						<span className="font-medium ml-2 text-left text-gray-700 text-sm w-full">
							{info.value || "--------"}
						</span>
					)}					
				</div>
			))}
		</div>
	</div>
)

export default InfoComp;