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
  evenBgColor?: string;
  gridStyle?: string;
  oddBgColor?: string;
  evenBorderColor?: string;
  oddBorderColor?: string;
  padding?: string;
	title?: string;
  titleColor?: string;
  titleColSpan?: string;
  valueColSpan?: string;
}

const InfoComp: FC<InfoCompType> = ({ 
  description, 
  infos, 
  evenBgColor,
  oddBgColor,
  evenBorderColor,
  oddBorderColor,
  gridStyle,
  padding,
  title,
  titleColor,
  titleColSpan,
  valueColSpan
}) => (
	
	<div className="bg-white shadow-md mt-4 mb-4 p-2 overflow-hidden sm:rounded-lg">
    {(title || description) && (
      <div className="px-4 py-5 sm:px-6">
        {title && (
          <h3 className={`${titleColor} capitalize text-lg leading-6 font-medium`}>
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        )}
      </div>
    )}
    
    <div className="border-t border-gray-200">
      <dl>
        {infos.map((detail, index) => (
          <div
            key={index}
            className={`${
              index % 2 === 0 ? evenBgColor : oddBgColor
            } ${padding} ${gridStyle}`}
          >
            <dt className={`${titleColSpan} text-sm font-medium text-gray-500 md:text-base`}>
              {detail.title}
            </dt>
            <dd className={`${valueColSpan} mt-1 text-sm text-gray-700 sm:mt-0 md:text-base`}>
              {detail?.type === "badge" ? (
                <div className="font-medium w-full">
									<div className="max-w-[120px]">
										<Badge margin="mx-1" title={String(detail.value)} {...detail.options} />
									</div>
								</div>
              ) : detail?.type === "image" ? (
                <div className={`${index % 2 === 0 ? evenBorderColor : oddBorderColor} border-2 h-[150px] rounded-full w-[160px]`}>
                  <img
                    alt={typeof detail.value === 'object' ? detail.value?.alt : "no-image"}
                    className="h-full rounded-full w-full"
                    src={typeof detail.value === 'object' ? detail.value?.src : DEFAULT_IMAGE}
                  />
                </div>
              ) : (
                String(detail.value) || "-------"
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </div>

)

InfoComp.defaultProps = {
  gridStyle: "sm:grid sm:grid-cols-3 sm:gap-4",
  padding: "px-4 py-5 sm:px-6",
  oddBgColor: "bg-white",
  evenBgColor: "bg-gray-50",
  oddBorderColor: "bg-white",
  evenBorderColor: "bg-gray-50",
  titleColor: "text-gray-600",
  titleColSpan: "",
  valueColSpan: "sm:col-span-2"
}

export default InfoComp;