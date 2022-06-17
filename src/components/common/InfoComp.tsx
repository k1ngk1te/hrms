import { FC } from "react";
import { DEFAULT_IMAGE } from "../../config"
import Badge from "./Badge";

type InfoCompType = {
	description?: string;
	infos: {
		options?: any;
		title: string;
		type?: "badge" | "image";
		value: any; // string | { alt: string; src: string }
	}[];
	title: string;
	titleWidth?: string;
}

const InfoComp: FC<InfoCompType> = ({ description, infos, title, titleWidth }) => (
	
	<div className="bg-white shadow-md mt-4 mb-4 p-2 overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="capitalize text-lg leading-6 font-medium text-gray-700">
        {title}
      </h3>
      {description && (
      	<p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
      )}
    </div>
    <div className="border-t border-gray-200">
      <dl>
        {infos.map((detail, index) => (
          <div
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-medium text-gray-500 md:text-base">
              {detail.title}
            </dt>
            <dd className="mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2 md:text-base">
              {detail?.type === "badge" ? (
                <div className="font-medium w-full">
									<div className="max-w-[120px]">
										<Badge margin="mx-1" title={detail.value} {...detail.options} />
									</div>
								</div>
              ) : detail?.type === "image" ? (
                <div className={`${index % 2 === 0 ? "border-white" : "border-gray-50"} border-2 h-[150px] rounded-full w-[160px]`}>
                  <img
                    alt={typeof detail.value === 'object' ? detail.value.alt : "no-image"}
                    className="h-full rounded-full w-full"
                    src={typeof detail.value === 'object' ? detail.value.src : DEFAULT_IMAGE}
                  />
                </div>
              ) : (
                detail.value || "-------"
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </div>

)

export default InfoComp;